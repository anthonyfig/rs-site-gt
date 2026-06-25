// Vercel serverless function — intelligent ingest (US gt-03-us-explorer-ingest, Decisions 0008/0010).
// step "propose": an agent reads an uploaded text document + the existing taxonomy and PROPOSES a
// schema-valid draft artifact (nothing is written). step "commit": on the human's confirmation, the
// proposed (possibly edited) artifact is created in Git via the GitHub Contents API. Secrets stay
// server-side. Scope here is text documents; binary/media → object storage is deferred (US-6 open Qs).

import { createRequire } from 'node:module';
import { verifyInternal } from './_auth.mjs';

const require = createRequire(import.meta.url);
let INDEX = [];
try { INDEX = (require('./_gt-index.json').items) || []; } catch { INDEX = []; }

const MODEL = process.env.GT_ASK_MODEL || 'claude-sonnet-4-6';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const GH_API = 'https://api.github.com';
const PARTS = ['01-project-context','02-domain-model','03-capability-specs','04-engineering-context','05-integration-contracts','06-eval-suite','07-decision-log'];
const TYPES = ['project-context','domain-entity','vocabulary','business-rule','capability-spec','user-story','media-asset','case-study','engineering-context','integration-contract','eval','decision'];
const CONF = ['high','medium','low'];
const today = () => new Date().toISOString().slice(0, 10);
const slugify = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);

const SYSTEM = [
  'You place new material into the Rootstrap Ground Truth (a Git repo of agent-native markdown).',
  'Given a document and the existing taxonomy, propose where ONE new draft artifact should live.',
  'Return ONLY a JSON object (no prose, no code fences) with keys: part (one of the allowed parts), type (one of the allowed types), title, applies_to (array of surfaces like "marketing-site","explorer","ground-truth"), related (array — use ONLY ids from the provided list), tags (array), updates_existing (an existing id this might instead update, or null), confidence (high|medium|low), rationale (one short paragraph on why it belongs there and what it impacts), body (the artifact content as markdown, starting with a single H1, NO frontmatter).',
  'Prefer updating-existing when the document clearly extends one artifact. Never invent ids in related.',
].join(' ');

function yamlList(arr) { return '[' + (arr || []).map(s => '"' + String(s).replace(/"/g, "'") + '"').join(', ') + ']'; }
function buildContent(f) {
  const fm = [
    '---',
    'id: ' + f.id,
    'title: "' + f.title.replace(/"/g, "'") + '"',
    'part: "' + f.part + '"',
    'type: ' + f.type,
    'owner: "' + f.owner.replace(/"/g, "'") + '"',
    'status: draft',
    'confidence: ' + f.confidence,
    'sources:',
    '  - "' + f.source.replace(/"/g, "'") + '"',
    'updated: ' + f.today,
    'last_validated: "pending"',
    'validated_by: "pending"',
    'applies_to: ' + yamlList(f.applies_to.length ? f.applies_to : ['marketing-site']),
    'related: ' + yamlList(f.related),
    'tags: ' + yamlList(f.tags),
    '---',
    '',
  ].join('\n');
  let body = String(f.body || '').trim();
  if (!/^#\s/m.test(body.split('\n')[0] || '')) body = '# ' + f.title + '\n\n' + body;
  return fm + body + '\n';
}

function parseJsonLoose(text) {
  let t = String(text || '').trim().replace(/^```(json)?/i, '').replace(/```$/,'').trim();
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  return JSON.parse(t);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed.' }); return; }
  const gate = await verifyInternal(req);
  if (!gate.ok) { res.status(gate.status).json({ error: gate.message }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const step = String((body && body.step) || 'propose');
  const decider = (gate.user && gate.user.email) || 'TBD — needs assignment';

  // ----- COMMIT (human gate already passed: the explicit confirm click) -----
  if (step === 'commit') {
    const path = String((body && body.path) || '');
    const content = String((body && body.content) || '');
    if (!/^ground-truth\/.+\.md$/.test(path) || path.includes('..')) { res.status(400).json({ error: 'Invalid target path.' }); return; }
    if (!content.trim()) { res.status(400).json({ error: 'Nothing to commit.' }); return; }
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || 'anthonyfig/rs-site-gt';
    const branch = process.env.GITHUB_BRANCH || 'main';
    if (!token) { res.status(501).json({ error: 'Git write-back is not configured (set GITHUB_TOKEN).', fallback: true }); return; }
    const ghHeaders = { authorization: 'Bearer ' + token, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'content-type': 'application/json', 'user-agent': 'rs-gt-explorer' };
    try {
      // refuse to clobber an existing file (ingest creates new artifacts)
      const head = await fetch(`${GH_API}/repos/${repo}/contents/${path}?ref=${branch}`, { headers: ghHeaders });
      if (head.ok) { res.status(409).json({ error: 'A file already exists at that path; rename the artifact.' }); return; }
      const put = await fetch(`${GH_API}/repos/${repo}/contents/${path}`, {
        method: 'PUT', headers: ghHeaders,
        body: JSON.stringify({ message: 'Ingest: add ' + path + ' (via Explorer)', content: Buffer.from(content, 'utf8').toString('base64'), branch }),
      });
      if (!put.ok) { const detail = (await put.text()).slice(0, 200); res.status(502).json({ error: `Commit failed (${put.status}).`, detail }); return; }
      const out = await put.json();
      res.status(200).json({ ok: true, path, commit: (out.commit && out.commit.html_url) || null });
    } catch (e) { res.status(502).json({ error: 'Commit failed.', detail: String((e && e.message) || e) }); }
    return;
  }

  // ----- PROPOSE (nothing is written) -----
  const text = String((body && body.text) || '').trim();
  const filename = String((body && body.filename) || 'pasted document').slice(0, 120);
  if (!text) { res.status(400).json({ error: 'Provide some document text to ingest.' }); return; }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(501).json({ error: 'The ingest agent is not configured (no model key).' }); return; }

  const taxonomy = INDEX.map(i => '- ' + i.id + ' · ' + i.part + ' · ' + i.type + ' · ' + (i.title || '')).join('\n');
  const user = 'Allowed parts: ' + PARTS.join(', ') + '\nAllowed types: ' + TYPES.join(', ')
    + '\n\nExisting artifacts (id · part · type · title):\n' + taxonomy
    + '\n\n=== Document to place (filename: ' + filename + ') ===\n' + text.slice(0, 12000);

  try {
    const r = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1800, system: SYSTEM, messages: [{ role: 'user', content: user }] }),
    });
    if (!r.ok) { const detail = (await r.text()).slice(0, 200); res.status(502).json({ error: `The ingest agent returned ${r.status}.`, detail }); return; }
    const data = await r.json();
    const raw = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
    let p; try { p = parseJsonLoose(raw); } catch { res.status(502).json({ error: 'Could not parse the proposal.', detail: raw.slice(0, 200) }); return; }

    const part = PARTS.includes(p.part) ? p.part : '03-capability-specs';
    const type = TYPES.includes(p.type) ? p.type : 'project-context';
    const title = String(p.title || filename).slice(0, 120);
    const slugBase = slugify(title) || 'ingested';
    const prefix = (part.match(/^(\d+)/) || [])[1] || '00';
    const ids = new Set(INDEX.map(i => i.id));
    let id = 'gt-' + prefix + '-' + slugBase, n = 1;
    while (ids.has(id)) { n++; id = 'gt-' + prefix + '-' + slugBase + '-' + n; }
    const related = Array.isArray(p.related) ? p.related.filter(x => ids.has(x)) : [];
    const confidence = CONF.includes(p.confidence) ? (p.confidence === 'high' ? 'medium' : p.confidence) : 'low'; // never auto-high

    const content = buildContent({
      id, title, part, type, owner: decider, confidence,
      source: 'Ingested via Explorer from ' + filename + ' (' + today() + ')',
      today: today(), applies_to: Array.isArray(p.applies_to) ? p.applies_to : [], related, tags: Array.isArray(p.tags) ? p.tags : [],
      body: p.body || '',
    });

    res.status(200).json({
      ok: true,
      proposal: {
        path: 'ground-truth/' + part + '/' + slugBase + '.md',
        id, part, type, title, related,
        updates_existing: (p.updates_existing && ids.has(p.updates_existing)) ? p.updates_existing : null,
        rationale: String(p.rationale || ''),
        confidence,
        content,
      },
    });
  } catch (e) { res.status(502).json({ error: 'Ingest failed.', detail: String((e && e.message) || e) }); }
}
