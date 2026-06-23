---
id: gt-04-data-model
title: "Data Model (Explorer)"
part: "04-engineering-context"
type: engineering-context
owner: "Platform Architect (suggested) + Anthony"
status: draft
confidence: medium
sources:
  - "Decision 0010 (Jun 2026): Git is the system of record; the database is the engine, rebuilt from Git"
  - "Decision 0008 (Jun 2026): media in Supabase Storage; MediaAsset attaches to any artifact"
  - "Entity Catalog (02-domain-model/entities.md): Ground Truth Artifact, Media Asset, relationships"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
related: ["gt-07-0010-git-system-of-record-db-engine", "gt-07-0008-ground-truth-database-backed-and-media", "gt-02-entities", "gt-03-capability-explorer", "gt-04-stack-and-architecture"]
tags: ["data-model", "schema", "supabase", "postgres", "rls"]
---

# Data Model (Explorer)

## Recommendation in one line
Model the Ground Truth as a small set of **Postgres tables + pgvector embeddings**, treat that
database as a **disposable read-model rebuilt from Git**, and enforce internal-only access with
**Row-Level Security** — so the Explorer is fast and queryable without ever becoming the source of
truth.

> **Confirmed (Decision 0010, Jun 2026): Git is the system of record; the database is the engine.**
> Every table below is **regenerated from the Git folder** of markdown + frontmatter (and Supabase
> Storage for binaries). The DB is never hand-edited as truth — the Explorer writes to Git, CI
> rebuilds the DB. **Write path:** Explorer → Git → CI rebuilds the DB. **Read path:** DB.

## What the database is — and isn't

| | Git (system of record) | Database (the engine) |
|---|---|---|
| **Holds** | Canonical artifact text: markdown + frontmatter, in folders | A queryable projection of that text + embeddings + media metadata |
| **Job** | History, diffs, review, rollback, the human gate | Search, graph traversal, chat/RAG, access control |
| **Lifecycle** | Permanent, authoritative | **Disposable** — can be dropped and rebuilt from Git at any time |
| **Edited by** | The Explorer (clean commit on approve) | Nobody by hand — only the rebuild pipeline |

This is the load-bearing rule: **no row is a source of truth.** If the DB and Git ever disagree,
Git wins and the DB is rebuilt. Audit/validation history is Git history (authored via the Explorer),
optionally mirrored into a DB table for fast display.

## Core tables

Keep the schema small and derived. Each row carries an `id` that matches the artifact's frontmatter
`id` and a `source_path` back to the Git file it was built from, so any record is traceable to truth.

| Table | Purpose | Key fields |
|-------|---------|-----------|
| **artifact** | One row per Ground Truth artifact (part, spec, story, etc.) | `id`, `title`, `part`, `type`, `status` (spec lifecycle), `delivery_status` (story build progress), `confidence`, `owner`, `last_validated`, `body` (markdown), `source_path`, `is_internal` (bool), `embedding` (pgvector) |
| **decision** | Architecture/ADR decisions (Part 07) | `id`, `title`, `status`, `date`, `owner`, `supersedes`, `body`, `source_path` |
| **open_question** | Tracked unknowns (the anti-placeholder rule, BR-11) | `id`, `question`, `status` (open/resolved), `owner`, `blocks` (artifact ids), `source_path` |
| **edge** | Typed relationships between artifacts (the graph) | `from_id`, `to_id`, `kind` (related / derives-from / supersedes / blocks), `source_path` |
| **media_asset** | First-class rich media (Decision 0008) | `id`, `type` (image/video/doc), `storage_url`, `title`/`caption`, `attached_to` (artifact id), `source`, `rights`/`credit` |

Supporting structures (kept minimal):
- **`embeddings`** via pgvector — powers **Ask** (semantic Q&A / RAG over Ground Truth) and
  **intelligent ingest** placement (where an uploaded doc belongs). May live as columns on
  `artifact`/`media_asset` rather than a separate table.
- **`validation`** (optional) — a fast-display mirror of the Git validation history (who approved
  what, when). The authoritative record is still the commit.

### Notes on key fields
- **`status` + `confidence`** drive **BR-1** (only `approved` truth may drive a production build or a
  priced capability) and let the Explorer visibly distinguish draft vs approved. **`delivery_status`**
  (user stories only) separately tracks build progress (backlog→in-progress→in-review→shipped) so the
  Explorer can run like a board; it never overrides the spec `status`.
- **`edge.kind`** captures the relationships the domain model already names (`related`,
  derives-from, supersedes, blocks) so the graph view and traceability are queryable, not implicit.
- **`media_asset.attached_to`** is how a case study "shows all its materials" — one artifact, many
  assets — and `rights`/`credit` keep logo/footage usage honest (cf. Client logo-rights in
  `02-domain-model/entities.md`).
- **`source_path`** on every table is the link back to Git; it makes the "rebuilt from Git" contract
  enforceable and every record auditable.

## Access control — Row-Level Security (BR-8)

The Explorer is **internal-only**, and some artifacts are stricter still (internal-only values per
**BR-8**: client revenue, deal sizes, tiering, the anti-ICP list). RLS enforces this **at the data
layer, not just the UI**:

- Every table with sensitive rows carries `is_internal` (or an equivalent sensitivity flag).
- **RLS policies** ensure a request that lacks internal entitlement **never receives internal-only
  rows** — not even as filtered-out IDs. Public/less-privileged contexts (e.g. any future public
  Explorer, OQ-2) can only ever read `is_internal = false`, `status = approved` rows.
- The marketing-site build derives from Git through the same boundary: internal artifacts are never
  emitted into public pages or `llms.txt`.

This makes the guardrail structural: even a bug in the front end cannot leak internal data, because
the database refuses to return it.

## Rebuild pipeline (how rows get there)
1. A change lands in Git (the Explorer authors a clean commit on approve — Decision 0010).
2. CI parses the changed markdown + frontmatter and **upserts** `artifact` / `decision` /
   `open_question` / `edge`, and reconciles `media_asset` metadata against Supabase Storage.
3. CI (re)computes **embeddings** for changed rows.
4. The Explorer reads the refreshed DB. A full rebuild from a clean Git checkout must reproduce the
   same DB — that round-trip is the consistency guarantee (`EV-GT-CONSISTENCY`, Part 06).

## What this is not
- **Not** the source of truth — see the table above; Git is.
- **Not** an exhaustive DDL — this is the shape and intent; column types/indexes are an
  implementation detail of `explorer/SPEC.md`.
- **Not** where business users version content — they validate through the Explorer UI; versioning
  is Git, invisibly.
