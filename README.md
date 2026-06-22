# rs-site-gt — Rootstrap Website Ground Truth

The living model of how Rootstrap works and what we're building. **Git is the system of record**
(Decision 0010); changes flow through the Explorer as commits, never developer hand-commits.
This repo is **self-contained** — the content *and* the tools that validate/navigate it.

## Contents
- `ground-truth/` — the 7-part Blueprint (01 Project Context … 07 Decision Log) + `_schema/` (metadata standard + templates)
- `sources/` — primary inputs (the Delivery v2 deck, the June 2026 Overview) for traceability
- `tools/ground-truth/` — the consistency **checker** + the **navigator** (Explorer v0 generator)
- `CLAUDE.md` — how agents/engineers work in this repo

## Use
```bash
npm run gt:check      # EV-GT-CONSISTENCY: metadata, status, link resolution (CI gate)
npm run gt:explorer   # regenerate ./ground-truth-explorer.html (open in a browser)
```

## Relationships
- **rs-site** (website code) *consumes* this repo — the software is derived from the Ground Truth.
- **rs-ip** holds the reusable method (agents/skills, the Explorer app); the Blueprint templates +
  tooling here get *promoted* to rs-ip as we generalize across projects.

Remote: `git@github.com:anthonyfig/rs-site-gt.git`
