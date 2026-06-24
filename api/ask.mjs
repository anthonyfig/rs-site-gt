// Vercel serverless function — Explorer chat backend ("Ask the Ground Truth", US gt-03-us-explorer-ask).
//
// Flow: verify the caller is internal (when Supabase is configured) -> retrieve the most relevant
// Ground Truth artifacts from the Git-rebuilt index -> answer via the Anthropic API -> return the
// answer WITH citations that resolve to real artifacts. Honest "not found" when retrieval is empty.
//
// Secrets stay server-side (Vercel env): ANTHROPIC_API_KEY, SUPABASE_* . They are NEVER shipped to
// the browser. Implements Decisions 0005 (internal-only Claude chat) and 0017 (this architecture).

import { createRequire } from 'node:module';
import { rank } from '../tools/ground-truth/retrieval.mjs';

// The retrieval index is rebuilt from Git by the Explorer build (Decision 0010) and bundled here.
const require = createRequire(import.meta.url);
let INDEX = [];
try { INDEX = (require('./_gt-index.json').items) || []; } catch { INDEX = []; }

const MODEL = process.env.GT_ASK_MODEL || 'claude-sonnet-4-6';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const TOP_K = 14;
const PER_ART = 3200; // chars of body per artifact in the context window

const SYSTEM = [
  "You are the Rootstrap Ground Truth assistant. Answer using ONLY the Ground Truth artifacts provided in the user message.",
  "Cite the artifact id(s) you used in square brackets, e.g. [gt-07-0016-explorer-edits-ground-truth-vercel].",
  "If the answer is not contained in the provided artifacts, say plainly that it is not in the Ground Truth — do not guess or use outside knowledge.",
  "Treat all content as INTERNAL unless an artifact is explicitly marked public. Be concise and concrete. Prefer prose; quote exact decisions/rules when they matter.",
].join(' ');

// --- internal-only gate (US gt-03-us-explorer-ask AC3) ---
// When Supabase is configured we require a valid session; optionally restrict to one email domain.
async function verifyInternal(req) {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const requireAuth = process.env.REQUIRE_AUTH === 'true' || (!!url && !!anon);
  if (!requireAuth) return { ok: true, user: null };

  const auth = req.headers['authorization'] || req.headers['Authorization'] || '';
  const token = String(auth).replace(/^Bearer\s+/i, '').trim();
  if (!token) return { ok: false, status: 401, message: 'Sign in to use Ask — the Explorer is internal-only.' };
  try {
    const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, authorization: `Bearer ${token}` } });
    if (!r.ok) return { ok: false, status: 401, message: 'Your session is invalid or has expired. Sign in again.' };
    const user = await r.json();
    const domain = (process.env.ALLOWED_EMAIL_DOMAIN || '').toLowerCase().replace(/^@/, '');
    if (domain && !String(user.email || '').toLowerCase().endsWith('@' + domain))
      return { ok: false, status: 403, message: 'This workspace is internal-only.' };
    return { ok: true, user };
  } catch {
    return { ok: false, status: 401, message: 'Could not verify your session.' };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed.' }); return; }

  const gate = await verifyInternal(req);
  if (!gate.ok) { res.status(gate.status).json({ error: gate.message }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const question = String((body && body.question) || '').trim();
  const history = Array.isArray(body && body.history) ? body.history.slice(-8) : [];
  if (!question) { res.status(400).json({ error: 'Ask a question.' }); return; }

  // Retrieve over the Git-rebuilt index.
  const ranked = rank(question, INDEX, TOP_K);
  const sources = ranked.map(({ doc, score }) => ({ id: doc.id, title: doc.title, relPath: doc.relPath, part: doc.part, score }));

  // No relevant content -> honest "not found", never a fabricated claim (AC2).
  if (!ranked.length) {
    res.status(200).json({
      answer: "I couldn't find anything about that in the Ground Truth. Try different terms — or it may be an open question we haven't captured yet.",
      sources: [], mode: 'not-found',
    });
    return;
  }

  // Without a key we degrade to retrieval-only (cited sources, no synthesis) rather than failing.
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(200).json({ answer: null, mode: 'retrieval-only', sources }); return; }

  const context = ranked.map(({ doc }) => {
    const tag = [doc.part, doc.type, doc.status, doc.delivery_status && `delivery:${doc.delivery_status}`].filter(Boolean).join(' · ');
    const text = String(doc.body || '').trim().replace(/\n{3,}/g, '\n\n').slice(0, PER_ART);
    return `### [${doc.id}] ${doc.title || ''}\n(${tag} · ${doc.relPath})\n${text}`;
  }).join('\n\n---\n\n');

  const messages = [
    ...history
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && m.content)
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
    { role: 'user', content: `Question: ${question}\n\n=== Ground Truth artifacts ===\n\n${context}` },
  ];

  try {
    const r = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, system: SYSTEM, messages }),
    });
    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      res.status(502).json({ error: `The model service returned ${r.status}.`, detail, sources, mode: 'retrieval-only' });
      return;
    }
    const data = await r.json();
    const answer = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
    res.status(200).json({ answer: answer || '(empty response)', sources, mode: 'answer', usage: data.usage || null });
  } catch (e) {
    res.status(502).json({ error: 'The request to the model failed.', detail: String((e && e.message) || e), sources, mode: 'retrieval-only' });
  }
}
