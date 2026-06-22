---
id: gt-07-0009-format-files-canonical-db-engine
title: "0009 — Ground Truth format: agent-friendly files are canonical; the store is the engine"
part: "07-decision-log"
type: decision
owner: "Platform Architect (suggested) + Anthony"
status: approved
confidence: high
sources: ["User direction (Jun 2026): GT must stay agent-friendly / folder-like; maybe not relational; analyze options", "User decision (Jun 2026): adopt the Git-as-system-of-record recommendation (Decision 0010)"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["ground-truth", "explorer"]
related: ["gt-07-0008-ground-truth-database-backed-and-media", "gt-04-stack-and-architecture"]
tags: ["adr", "architecture", "format", "agent-friendly"]
---

# 0009 — Files are the canonical format; the database is the engine

**Status:** Accepted — sharpened by [Decision 0010](0010-git-system-of-record-db-engine.md): the canonical store is **Git**; the database is rebuilt *from* Git. · **Date:** 2026-06-22

## Context
Decision 0008 makes the Ground Truth database-backed (uploads, media, history, no commits). But it
must stay **agent-friendly**: agents read and write **markdown + folders** best, and that's the
whole reason the blueprint is markdown today. Tension to resolve — and "maybe it's not relational."

## Options analyzed
| Option | What | Pros | Cons |
|--------|------|------|------|
| **A — Files-first, DB-derived** | Markdown folder is the source of truth; the DB is a rebuilt index | Maximally agent-friendly; zero lock-in; what we have now | Multi-user edits, validation history & media UX are awkward on a hosted app; "server filesystem as SoT" is fragile |
| **B — DB-first + continuous export** | Explorer writes the DB; an exporter re-materializes the markdown folder on every change | Great app UX + history + media; agents always get a fresh folder; no commits | Two representations to keep in sync (export must be reliable) |
| **C — Document+index hybrid (Supabase)** | Postgres used *document-style*: body stored **as markdown**, `metadata` JSONB, `edges` table (graph), pgvector, Storage media, `validations` history | One store we already chose; markdown stays canonical; supports query/Explorer/ingest | Still Postgres (but used as a document/graph store, not shredded rows) |
| **D — Graph DB (Neo4j)** | The Business Twin as a native graph | Relationships native | Extra infra; weaker built-in full-text/vector; Supabase already chosen |

## Decision (recommended)
**Files are the canonical, agent-friendly format; the database is the engine.**
- **Pilot stays files-first (Option A)** — the markdown folder we have. Zero infra, maximally readable by agents.
- As the Explorer comes online, adopt **Option C** (Supabase document+index hybrid) **with a continuous markdown export from Option B**, so the **agent-friendly folder always exists and is the artifact's canonical shape**. The DB adds metadata, graph edges, vectors, media, and validation history. The **Explorer commits to Git** on the user's behalf — no developer hand-commits (sharpened by Decision 0010).
- **Reject** "relational shredding" of the markdown and a separate graph DB for now.

## Principle
**The canonical artifact is always a markdown file with frontmatter; the store augments the format, it never replaces it.** An agent can always be handed the folder.

## Consequences
- `packages/ground-truth` reads the folder (today) and later the export; the schema mirrors the frontmatter (Postgres columns/JSONB).
- The checker + agents operate on the folder representation regardless of where the SoT lives.
