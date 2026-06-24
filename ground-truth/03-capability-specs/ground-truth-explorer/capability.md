---
id: gt-03-capability-explorer
title: "Capability: Ground Truth Explorer"
part: "03-capability-specs"
type: capability-spec
owner: "Product Architect (suggested) + Anthony"
status: draft
confidence: medium
sources:
  - "Decision 0005 — Explorer internal-only, Claude-powered chat over the Ground Truth"
  - "Decision 0010 — Git is the system of record; the Explorer is a Git-backed UI that commits on the user's behalf"
  - "Decision 0008 — media is first-class; intelligent ingest proposes placement behind a human gate"
  - "Decision 0012 — the Explorer is a core-platform function, not a marketing page"
  - "rs-ip explorer/SPEC.md (Explorer design)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
related: ["gt-07-0005-explorer-internal-claude-chat", "gt-07-0010-git-system-of-record-db-engine", "gt-07-0008-ground-truth-database-backed-and-media", "gt-03-index"]
tags: ["explorer", "internal", "business-twin", "knowledge-management"]
tier: "C4"
---

# Capability: Ground Truth Explorer

> **Human-facing** unit of *value* — the "what & why" stakeholders validate. The executable detail
> lives in the **six user stories** linked below (agent-facing). See Decision `0007`.

## Purpose
Give the people who own the model a single internal workspace to **manage** the Ground Truth:
browse every artifact in a filterable table, open any one to read its metadata and trace it to its
sources, see where the model is weak (gaps, low confidence, unowned, stale), ask questions of it in
plain language, validate artifacts so they carry weight, and ingest new material into the right
place. It is both the day-to-day management tool for the Ground Truth **and** the dogfood that
proves Rootstrap's method on Rootstrap's own model. The Explorer is **internal-only**
(Decision 0005) and **Git-backed** (Decision 0010): it is a friendly surface over a Git repository
of agent-native markdown, and the database is the engine that powers search, the relationship map,
and chat.

## Actors
Internal Rootstrap user (authenticated, can browse/ask/ingest) · Validator (an internal user with
the right to mark artifacts validated and trigger a commit) · the Ask agent (answers questions over
the Ground Truth via the Anthropic/Claude API, with citations) · the Ingest agent (reads an upload
and proposes where it belongs) · the system (Git + database engine). Non-internal users are **out of
scope** for this tool entirely — they never reach it.

## Outcomes / success
- An owner can find any artifact and judge its health in seconds, without reading raw files in Git.
- Every artifact is one click from its **sources** (trace-to-source) and from its **direct
  relationships** — without the old global "hairball" graph.
- The model's weak spots are visible on one **health/gaps** panel, so revalidation and ownership are
  driven by data, not memory.
- Questions about the model get answered in plain language, **with citations to the artifacts** the
  answer drew from — internal-only.
- Validating and adding to the model happens through a **human gate**; each accepted change becomes
  **one clean Git commit** (the audit trail), and no one hand-writes raw commits.

## Scope
**In:** the core browse + management surface (a sortable/filterable **table of every artifact** plus
a per-artifact view with metadata and trace-to-source); a **health/gaps** panel; a **Relationship
Map** as its own focus+context section; **Ask** (chat over the Ground Truth with citations);
**Validate → commit**; and **Ingest** (upload → proposed placement → human gate).
**Out:** the public marketing site and any public proof surface (that is the marketing site's job,
not the Explorer's); editing the model by hand-writing raw Git commits (Decision 0010 forbids this);
serving internal-only artifacts to anyone who is not an authenticated internal user (BR-8).

## Capability-level acceptance
Satisfied by the sum of the six user stories below.
- [ ] **Internal-only** (Decision 0005): the Explorer is authenticated; a non-internal user can
  never reach it and never sees an internal-only artifact (BR-8, `EV-INTERNAL-LEAK`).
- [ ] **The core is browse + management:** a single table lists **every** artifact with status,
  owner, confidence, area, and last-validated, sortable and filterable; opening any artifact shows
  its metadata and **traces it to its sources** (US-1).
- [ ] The **Relationship Map is its own section**, not the centerpiece: it centers **one** artifact
  and shows only its **direct** connections, recenters on click, and never renders the global tangle
  (US-2).
- [ ] A **health/gaps** panel surfaces items needing revalidation, low-confidence, unowned,
  still-draft, capabilities lacking user stories, and open questions (US-3).
- [ ] **Ask** answers questions over the Ground Truth via the Anthropic/Claude API and **cites the
  artifacts** each answer draws from; it is internal-only (US-4).
- [ ] **Validate → commit:** a validator marks an artifact validated and the Explorer writes a
  **clean commit on their behalf** (Decision 0010); this is a **human gate**, and no raw direct
  commits are exposed (US-5, `EV-HUMAN-GATE`).
- [ ] **Ingest:** an internal user uploads a document or media, an agent **proposes where it
  belongs**, and **a human confirms before anything lands** (Decision 0008, US-6, `EV-HUMAN-GATE`).
- [ ] **Decisions workspace:** a tracked board of every decision (status, owner, date, what it
  affects) plus open questions, and a **compose-to-export** path that produces a schema-valid
  decision file for human commit — Git stays the system of record (US-7, Decisions 0010/0017).
- [ ] The Ground Truth text shown and written is the **Git repository** (canonical); the database is
  the engine, rebuilt from Git (Decision 0010).

## User stories (agent-facing)
- [ ] [EXPLORER-1 · Browse the Ground Truth in a table](us-1-browse-and-table.md) — the core surface.
- [ ] [EXPLORER-2 · Explore one artifact's relationships (focus + context)](us-2-relationship-map.md)
- [ ] [EXPLORER-3 · See health & gaps in the model](us-3-health-and-gaps.md)
- [ ] [EXPLORER-4 · Ask the Ground Truth (chat with citations)](us-4-ask-the-ground-truth.md)
- [ ] [EXPLORER-5 · Validate an artifact → clean commit](us-5-validate-and-commit.md)
- [ ] [EXPLORER-6 · Ingest a document (proposed placement + human gate)](us-6-ingest-a-document.md)
- [ ] [EXPLORER-7 · Track decisions & propose a new one (compose-to-export)](us-7-decisions-workspace.md)

## Evals
Per-story functional evals (in each story), plus the shared suite: `EV-GT-CONSISTENCY` (the model is
internally consistent and the index matches the files), `EV-INTERNAL-LEAK` (no internal-only
artifact is ever served to a non-internal user), `EV-HUMAN-GATE` (validate and ingest never apply a
change without explicit human confirmation), and `EV-A11Y` (the workspace is keyboard- and
screen-reader-operable). See `06-eval-suite`.

## Open questions / human gates
- **Auth provider** for internal sign-in and how "internal user" vs "validator" rights are assigned
  → Platform + Anthony.
- The exact **commit-authoring mechanism** the Explorer uses to write on a validator's behalf
  (commit message format, branch/PR vs direct-to-main, who is recorded as author) → Platform,
  consistent with Decision 0010.
- How the Ask agent **selects and ranks** the artifacts it cites, and how it behaves when retrieval
  finds nothing relevant → Product + Anthony.
- The taxonomy the **Ingest** agent maps into (which parts/areas it may propose) → Product, aligned
  with `02/entities`.

## Sources & traceability
Decision 0005 (internal-only + Claude chat), Decision 0010 (Git system of record, Explorer commits
on the user's behalf), Decision 0008 (media first-class, intelligent ingest behind a human gate),
Decision 0012 (Explorer is a function), and the Explorer design in rs-ip `explorer/SPEC.md`.
