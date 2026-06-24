// Vercel serverless function — record a decision outcome back to Git.
// Implements US gt-03-us-explorer-decisions + Decisions 0010/0016/0019: an authenticated internal
// user approves / requests changes / rejects a decision; the Explorer updates the decision's .md
// (frontmatter + an appended outcome note) and commits it via the GitHub Contents API. The repo
// token stays server-side. After the commit, Vercel rebuilds and the board reflects the new status.

import { createRequire } from 'node:module';
import { verifyInternal } from './_auth.mjs';

const require = createRequire(import.meta.url);
let INDEX = [];
try { INDEX = (require('./_gt-index.json').items) || []; } catch { INDEX = []; }

const GH_API = 'https://api.github.com';
const STATUS_FOR = { approve: 'approved', reject: 'deprecated', 'request-changes': null }; // null = keep status
const LABEL_FOR = { approve: 'Approved', reject: 'Rejected', 'request-changes': 'Changes requested' };
const today = () => new Date().toISOString().slice(0, 10);

// Replace/insert top-level frontmatter keys, leaving the body untouched.
function setFrontmatter(md, updates) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  let fm = m[1]; const body = m[2];
  for (const [k, v] of Object.entries(updates)) {
    const re = new RegExp('^' + k + ':.*$', 'm');
    const line = k + ': ' + v;
    fm = re.test(fm) ? fm.replace(re, line) : (fm + '\n' + line);
  }
  return '---\n' + fm + '\n---\n' + body;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed.' }); return; }

  const gate = await verifyInternal(req);
  if (!gate.ok) { res.status(gate.status).json({ error: gate.message }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const id = String((body && body.id) || '').trim();
  const outcome = String((body && body.outcome) || '').trim();
  const rationale = String((body && body.rationale) || '').trim();
  if (!id || !(outcome in LABEL_FOR)) { res.status(400).json({ error: 'Need a decision id and a valid outcome.' }); return; }

  const item = INDEX.find(i => i.id === id && i.type === 'decision');
  if (!item || !item.relPath) { res.status(404).json({ error: 'Decision not found in the model.' }); return; }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'anthonyfig/rs-site-gt';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const decider = (gate.user && gate.user.email) || 'internal user';

  // Human gate is the explicit click; write-back needs a server-side repo token. Without it, tell the
  // client to fall back to manual commit rather than failing silently.
  if (!token) {
    res.status(501).json({ error: 'Git write-back is not configured. Add GITHUB_TOKEN (repo Contents: read/write) to the deployment env.', fallback: true });
    return;
  }

  const path = item.relPath; // e.g. ground-truth/07-decision-log/0017-....md (safe path chars)
  const ghHeaders = {
    authorization: 'Bearer ' + token,
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'content-type': 'application/json',
    'user-agent': 'rs-gt-explorer',
  };

  try {
    const getRes = await fetch(`${GH_API}/repos/${repo}/contents/${path}?ref=${branch}`, { headers: ghHeaders });
    if (!getRes.ok) { res.status(502).json({ error: `Could not read the decision file (${getRes.status}).` }); return; }
    const file = await getRes.json();
    const current = Buffer.from(file.content || '', 'base64').toString('utf8');

    const updates = { updated: today() };
    const newStatus = STATUS_FOR[outcome];
    if (newStatus) {
      updates.status = newStatus;
      updates.last_validated = '"' + today() + '"';
      updates.validated_by = '"' + decider.replace(/"/g, "'") + '"';
    }
    let next = setFrontmatter(current, updates);
    if (!next) { res.status(500).json({ error: 'Could not parse the decision file.' }); return; }

    const note = '\n## Decision outcome (' + today() + ')\n'
      + '- **Outcome:** ' + LABEL_FOR[outcome] + '\n'
      + '- **By:** ' + decider + '\n'
      + '- **Rationale:** ' + (rationale || '—') + '\n';
    next = next.replace(/\s*$/, '') + '\n' + note;

    const putRes = await fetch(`${GH_API}/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify({
        message: LABEL_FOR[outcome] + ': ' + (item.title || id) + ' (via Explorer)',
        content: Buffer.from(next, 'utf8').toString('base64'),
        sha: file.sha,
        branch,
      }),
    });
    if (!putRes.ok) {
      const detail = (await putRes.text()).slice(0, 200);
      res.status(502).json({ error: `Commit failed (${putRes.status}).`, detail });
      return;
    }
    const out = await putRes.json();
    res.status(200).json({ ok: true, status: newStatus || item.status, outcome, commit: (out.commit && out.commit.html_url) || null });
  } catch (e) {
    res.status(502).json({ error: 'Write-back failed.', detail: String((e && e.message) || e) });
  }
}
