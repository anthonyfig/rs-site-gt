---
id: gt-07-0008-ground-truth-database-backed-and-media
title: "0008 — Ground Truth is database-backed (not git commits); media + intelligent ingest are first-class"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: approved
confidence: high
sources: ["User direction (Jun 2026): don't use git for GT changes — DB-based; support images/video/docs; upload a document and place it in the GT intelligently; case-study materials in the GT"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["ground-truth", "explorer", "marketing-site"]
related: ["gt-04-stack-and-architecture", "gt-07-0005-explorer-internal-claude-chat", "gt-02-entities"]
tags: ["adr", "architecture", "database", "media", "ingest"]
---

# 0008 — Ground Truth is database-backed; media + intelligent ingest are first-class

**Status:** Accepted · **Date:** 2026-06-22 · **Owner:** Anthony

## Context
Business users will edit, upload, and validate the model. Per-edit **git commits are the wrong
granularity and the wrong audience.** The Ground Truth also has to hold **rich media** (images,
video, documents) and let someone **upload materials and have them placed intelligently**.

## Decision
- **Git is the system of record for the Ground Truth text** (agent-native markdown + frontmatter);
  **media** lives in **Supabase Storage**; the **database (Postgres + pgvector) is the engine** —
  search, graph, chat, RLS — **rebuilt from Git**. The **Explorer** is a Git-backed UI: on validate
  it authors a clean commit on the user's behalf (they never see Git). *(System-of-record refined by
  [Decision 0010](0010-git-system-of-record-db-engine.md); the media + ingest decisions below stand.)*
- **Media is first-class:** a `MediaAsset` (image/video/doc) attaches to any artifact; a case study
  shows all its materials.
- **Intelligent ingest:** uploading a document/image → an agent reads + classifies it and
  **proposes where it impacts the Ground Truth** (which artifacts/parts, what changes) → a **human
  gate** confirms and applies.

## Consequences
- DB schema: `artifacts`, `user_stories`, `media`, `sources`, `edges` (related), `validations`
  (history). Storage bucket for media. Embeddings (pgvector) power placement + Ask.
- The consistency checker (`EV-GT-CONSISTENCY`) runs against the DB/export, not just files.
- The current markdown files are the **v0.1 seed**; the Explorer's ingest/validate flows are the
  long-term write path (see `explorer/SPEC.md`).
