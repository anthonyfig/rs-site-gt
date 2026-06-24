#!/usr/bin/env node
// Ask the Ground Truth — zero-dependency CLI agent.
// Retrieves the most relevant GT artifacts for a question and answers via the
// Anthropic API, citing artifact ids. Honest "not found" when the GT is silent.
// Implements the EXPLORER "Ask the Ground Truth" story + 05/anthropic-api.md contract,
// at the command line (the web Explorer is the same idea with a UI).
//
// Usage:
//   node tools/ground-truth/ask.mjs "your question"
//   node tools/ground-truth/ask.mjs --retrieval-only "question"   # no API call, just show matches
//   node tools/ground-truth/ask.mjs --top 18 "question"
//
// Key: reads ANTHROPIC_API_KEY from the environment, else from the nearest .env
// (searched upward from this repo). The key is never printed or logged.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadArtifacts, REPO_ROOT } from './lib.mjs';
import { rank } from './retrieval.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODEL = process.env.GT_ASK_MODEL || process.env.MODEL || 'claude-sonnet-4-6';
const API_URL = 'https://api.anthropic.com/v1/messages';

// ---------- args ----------
const argv = process.argv.slice(2);
let topK = 14, retrievalOnly = false;
const qparts = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--retrieval-only' || a === '-r') retrievalOnly = true;
  else if (a === '--top') topK = parseInt(argv[++i], 10) || topK;
  else qparts.push(a);
}
const question = qparts.join(' ').trim();
if (!question) {
  console.log('Usage: node tools/ground-truth/ask.mjs [--retrieval-only] [--top N] "your question"');
  process.exit(1);
}

// ---------- .env loader (find ANTHROPIC_API_KEY without printing it) ----------
function findKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  const seen = new Set();
  for (const start of [REPO_ROOT, __dirname, process.cwd()]) {
    let dir = start;
    for (let depth = 0; depth < 6; depth++) {
      const f = path.join(dir, '.env');
      if (!seen.has(f) && fs.existsSync(f)) {
        seen.add(f);
        const line = fs.readFileSync(f, 'utf8').split('\n').find(l => /^\s*ANTHROPIC_API_KEY\s*=/.test(l));
        if (line) {
          let v = line.slice(line.indexOf('=') + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
          if (v) return v;
        }
      }
      const up = path.dirname(dir);
      if (up === dir) break;
      dir = up;
    }
  }
  return null;
}

// ---------- retrieval (shared keyword ranking; no embeddings, no deps) ----------
const arts = loadArtifacts().filter(a => a.isArtifact);
const docs = arts.map(a => ({ ref: a, id: a.id, title: a.meta.title || '', tags: a.meta.tags || [], body: a.body }));
const ranked = rank(question, docs, topK).map(({ doc, score }) => ({ a: doc.ref, s: score }));

if (ranked.length === 0) {
  console.log('No Ground Truth artifacts matched that question. Try different terms, or run with --top to widen.');
  process.exit(0);
}

// build a token-bounded context block
const PER_ART = 3200; // chars of body per artifact
function block(a) {
  const m = a.meta;
  const tag = [m.part, m.type, m.status, m.delivery_status && `delivery:${m.delivery_status}`].filter(Boolean).join(' · ');
  const body = a.body.trim().replace(/\n{3,}/g, '\n\n').slice(0, PER_ART);
  return `### [${a.id}] ${m.title || ''}\n(${tag} · ${a.relPath})\n${body}`;
}
const context = ranked.map(x => block(x.a)).join('\n\n---\n\n');

// ---------- retrieval-only mode ----------
function printSources() {
  console.log('\nRetrieved artifacts:');
  for (const { a, s } of ranked) console.log(`  [${a.id}]  ${a.meta.title || ''}  (score ${s})  — ${a.relPath}`);
}
if (retrievalOnly) {
  console.log(`Top ${ranked.length} matches for: "${question}"`);
  printSources();
  process.exit(0);
}

// ---------- answer via Anthropic API ----------
const key = findKey();
if (!key) {
  console.log('No ANTHROPIC_API_KEY found (env or .env). Showing retrieval-only results instead.\n');
  printSources();
  process.exit(0);
}

const SYSTEM = [
  "You are the Rootstrap Ground Truth assistant. Answer the question using ONLY the Ground Truth artifacts provided in the user message.",
  "Cite the artifact id(s) you used in square brackets, e.g. [gt-07-0010-git-system-of-record-db-engine].",
  "If the answer is not contained in the provided artifacts, say plainly that it is not in the Ground Truth — do not guess or use outside knowledge.",
  "Treat all content as INTERNAL unless an artifact is explicitly marked public. Be concise and concrete. Prefer prose; quote exact decisions/rules when relevant.",
].join(' ');

const payload = {
  model: MODEL,
  max_tokens: 1024,
  system: SYSTEM,
  messages: [{ role: 'user', content: `Question: ${question}\n\n=== Ground Truth artifacts ===\n\n${context}` }],
};

try {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error(`API error ${res.status}: ${txt.slice(0, 400)}`);
    console.error('\nFalling back to retrieval-only:');
    printSources();
    process.exit(1);
  }
  const data = await res.json();
  const answer = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
  console.log(answer || '(empty response)');
  printSources();
  if (data.usage) console.error(`\n(model ${MODEL} · in ${data.usage.input_tokens} / out ${data.usage.output_tokens} tokens)`);
} catch (e) {
  console.error('Request failed:', e.message);
  printSources();
  process.exit(1);
}
