# Ground Truth tools

Zero-dependency Node tools (Node 18+) to **navigate** and **check** the Ground Truth. No install,
no Supabase, no API key — these are the local precursor to the full internal Explorer.

## Commands
```bash
npm run gt:check       # or: node tools/ground-truth/check.mjs
npm run gt:explorer    # or: node tools/ground-truth/build-explorer.mjs  ->  ground-truth-explorer.html
```

## `check.mjs` — consistency checker (EV-GT-CONSISTENCY)
Validates every artifact under `ground-truth/`:
- metadata complete (`id, title, part, type, owner, status, confidence, sources, updated, last_validated, applies_to`)
- `status` and `confidence` are from the allowed sets
- nothing is `approved` while `last_validated` is still `pending`
- every `related:` id resolves to a real artifact

Exits non-zero on errors → drop it into CI as a gate. This is the `ground-truth-guardian`
agent's logic as a deterministic script.

## `build-explorer.mjs` — navigator (Explorer v0)
Generates a single self-contained `ground-truth-explorer.html` (open it directly in a browser):
- **Browse** by blueprint part, with status dots
- **Trace** — every artifact shows its sources and clickable `related` links (the Business Twin edges)
- **Status** — metadata panel (owner, status, confidence, last-validated) + an Overview with the
  consistency report and the decision list
- Search across artifacts

It renders the markdown bodies, so it reflects the *actual* current Ground Truth each time you run it.

## What's NOT here yet (the full internal Explorer)
Ask/**chat with your Ground Truth** (Claude API), the **Validate** review-queue with status
write-back, and **Generate** (specs/evals from the model). Those need Supabase + an Anthropic API
key and ship with the internal app — see [`/explorer/SPEC.md`](../../explorer/SPEC.md).
