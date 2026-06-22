---
id: gt-07-0010-git-system-of-record-db-engine
title: "0010 — Git for the truth, the database for the experience"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor) + Platform Architect"
status: approved
confidence: high
sources: ["User decision (Jun 2026): follow recommendation — 'Git for the truth, DB for the experience; the Explorer writes to Git behind a friendly UI'"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["ground-truth", "explorer", "marketing-site"]
related: ["gt-07-0008-ground-truth-database-backed-and-media", "gt-07-0009-format-files-canonical-db-engine", "gt-04-stack-and-architecture"]
tags: ["adr", "architecture", "git", "database", "explorer"]
---

# 0010 — Git for the truth, the database for the experience

**Status:** Accepted · **Date:** 2026-06-22 · **Owner:** Anthony
**Supersedes** the "DB is the system of record" stance of 0008; **confirms + sharpens** 0009.

## Context
0008 framed the living Ground Truth as database-backed with changes as DB transactions ("not
commits"). On reflection that conflated two separate things: **(a) where the canonical text lives**
and **(b) the editing UX**. The canonical Ground Truth text is structured markdown — for which Git
is the **agent-native** format and provides history, diffs, review, and rollback for free; **PRs are
the review queue + human gate.** The database's real job is the *experience* (search, graph, chat,
access control, media) — none of which require it to be the source of truth for the text.

## Decision
- **Git is the system of record for the Ground Truth text** — specs, user stories, decisions, domain
  model, engineering context — as agent-native markdown + frontmatter in a folder.
- **Media** (images, video, docs, case-study materials) lives in **object storage** (Supabase
  Storage), referenced from the markdown. (Git is bad at binaries.)
- **The database is the engine, not the source of truth:** Postgres + pgvector, **rebuilt/synced
  from Git** on every change. It powers the Explorer's search, graph, chat (Claude API), and RLS for
  internal-only data.
- **The Explorer is a Git-backed UI:** business users edit / upload / validate through a friendly
  interface; on **approve**, the Explorer authors a **clean, structured commit on the user's behalf**
  — they never see Git. **One commit = one validated change = the audit trail + human gate.**
- **Dropped:** developer hand-commits of Ground Truth, and per-edit/keystroke commits exposed to anyone.

## Why (the honest reasoning)
Git isn't a compromise for structured text — it's the right tool: agent-native, free history/review,
and code-derived-from-truth lives in the same repo. The user's real requirements — agent-friendly
folders, no raw commits, rich media, a non-technical UI — are all satisfied by "Explorer commits to
Git behind a UI + media in Storage," without reinventing version control inside a database.

## Flip condition
Revisit only at **multi-tenant scale with many concurrent, real-time business editors**
(Google-Docs-style simultaneity across many clients' Ground Truths), where Git's merge/latency
ceiling would bite. Not anticipated for a single company's Ground Truth.

## Consequences
- **Write path:** Explorer → Git (commit/PR) → CI rebuilds the DB index + embeddings. **Read path:** DB.
- `EV-GT-CONSISTENCY` and all agents operate on the Git folder (canonical).
- Validation history = Git history (authored via the Explorer), plus a DB audit table if useful.
- Read replicas / the marketing site build also derive from Git.
