// Shared keyword retrieval for the Ground Truth (zero-dependency).
// Used by ask.mjs (CLI) and api/ask.mjs (Explorer chat backend) so both rank identically.
// Keyword overlap is deliberate for a ~60-artifact corpus; pgvector is deferred (Decision 0017).

export const STOP = new Set(
  'the a an and or of to in on for is are be we our you your it this that with as at by from into about how what which who why when where do does can will would should i me my'.split(' ')
);

// Lowercase word tokens, ≥3 chars, minus stopwords.
export function tokens(s) {
  return (String(s == null ? '' : s).toLowerCase().match(/[a-z0-9][a-z0-9\-]{1,}/g) || [])
    .filter(t => t.length >= 3 && !STOP.has(t));
}

// Score one doc {id, title, tags, body} against the query tokens.
export function score(qToks, doc) {
  const title = String(doc.title || '').toLowerCase();
  const tags = (Array.isArray(doc.tags) ? doc.tags.join(' ') : String(doc.tags || '')).toLowerCase();
  const id = String(doc.id || '').toLowerCase();
  const body = String(doc.body || '').toLowerCase();
  let s = 0;
  for (const t of qToks) {
    if (id.includes(t)) s += 4;
    if (title.includes(t)) s += 3;
    if (tags.includes(t)) s += 3;
    s += Math.min(body.split(t).length - 1, 6); // cap body weight per term
  }
  return s;
}

// Rank docs for a question. Returns [{ doc, score }] sorted desc, score>0, top K.
export function rank(question, docs, topK = 14) {
  const qToks = [...new Set(tokens(question))];
  return docs
    .map(doc => ({ doc, score: score(qToks, doc) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
