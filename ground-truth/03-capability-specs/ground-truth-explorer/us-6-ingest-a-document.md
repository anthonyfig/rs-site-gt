---
id: gt-03-us-explorer-ingest
title: "EXPLORER-6 · Ingest a document (proposed placement + human gate)"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Anthony"
status: draft
delivery_status: in-progress
confidence: medium
sources:
  - "Capability gt-03-capability-explorer"
  - "Decision 0008 — intelligent ingest: an agent proposes where an upload impacts the Ground Truth; a human gate confirms and applies"
  - "Decision 0010 — applying ingest authors a clean commit; media lives in object storage"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
capability: gt-03-capability-explorer
related: ["gt-03-capability-explorer", "gt-07-0008-ground-truth-database-backed-and-media", "gt-07-0010-git-system-of-record-db-engine"]
tags: ["explorer", "ingest", "media", "human-gate"]
---

# User story: Ingest a document (proposed placement + human gate)

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

> **Shipped — text-ingest slice (Jun 2026):** the Explorer has an **Ingest** view. Paste or upload a
> `.md`/`.txt` document → `/api/ingest` (propose) asks the agent to place it, returning a
> **schema-valid `draft` artifact** (proposed part/type/title, links to real artifacts, rationale) —
> **nothing is written** (AC1/AC2). On **Confirm**, `/api/ingest` (commit) creates the file in Git via
> the GitHub Contents API (AC3); **Reject** writes nothing (AC4); the flow is internal-only (AC5).
> **Deferred:** binary/media → object storage (the open Platform questions below: media types, bucket).

**As an** internal Rootstrap user **I want** to upload a document or media item and have an agent
propose where it belongs in the Ground Truth **so that** new material lands in the right place — but
only after a human confirms.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Internal user (authenticated) | Upload a document/media; review and confirm/reject the proposed placement | Reach the Explorer if not authenticated; bypass the human gate |
| Ingest agent | Read and classify the upload; **propose** where it impacts the Ground Truth | Apply any change to the model on its own (Decision 0008) |
| Explorer (system) | On confirmation, store media in object storage and author a clean commit (Decision 0010) | Land anything before explicit human confirmation |
| Non-internal user | — | Reach ingest or see any internal-only artifact (BR-8) |

## Preconditions
- The user is authenticated as an internal Rootstrap user (Decision 0005).
- Intelligent ingest is in scope: an agent proposes placement, a human gate confirms (Decision 0008).
- On apply, text changes commit to Git and media goes to object storage, referenced from the markdown
  (Decision 0010).

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-explorer-ingest-AC1): Upload → agent proposes placement**
- **Given** I upload a document or media item
- **When** the Ingest agent processes it
- **Then** it **proposes where the item belongs** — which artifact(s)/part it impacts and what
  changes — without applying anything yet (Decision 0008).

**Scenario (gt-03-us-explorer-ingest-AC2): Human gate before it lands**
- **Given** a proposed placement
- **When** I have not confirmed it
- **Then** **nothing is written** to the Ground Truth — no artifact is changed and no media is
  attached until I confirm.

**Scenario (gt-03-us-explorer-ingest-AC3): Confirm → it lands as a clean commit**
- **Given** a proposed placement I have reviewed
- **When** I confirm it
- **Then** the change is applied: media is stored in object storage and the text change is authored as
  a **clean Git commit** on my behalf (Decisions 0008, 0010).

**Scenario (gt-03-us-explorer-ingest-AC4): Reject → no change**
- **Given** a proposed placement
- **When** I reject it
- **Then** the Ground Truth is unchanged and no commit is written.

**Scenario (gt-03-us-explorer-ingest-AC5): No internal leak**
- **Given** a non-internal user
- **When** they attempt to reach ingest
- **Then** they are refused and no internal-only artifact (BR-8) is shown.

## Definition of done
- [ ] All scenarios pass their evals · keyboard- and screen-reader-operable (WCAG AA) ·
  no placeholder content (BR-11) · nothing lands without a human gate (Decision 0008); applied
  changes commit via the Explorer (Decision 0010).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC2 / AC4 | `EV-HUMAN-GATE` | nothing is written to the Ground Truth without explicit human confirmation |
| AC1 | `EV-INGEST-PLACEMENT` | the proposal names plausible target artifact(s)/part and proposed changes |
| AC3 | `EV-EXPLORER-INGEST` | on confirm, media is stored and exactly one clean commit applies the change |
| AC3 | `EV-GT-CONSISTENCY` | after apply + rebuild, the model matches the committed Git state |
| AC5 | `EV-INTERNAL-LEAK` | no internal-only artifact is served to a non-internal user |
| A11y | `EV-A11Y` | the flow is operable by keyboard and screen reader; no blocking violations |

## Notes / human gates
- The **taxonomy** the agent may propose into (which parts/areas/artifacts) → Product, aligned with
  `02/entities`.
- Accepted media types and size limits, and where the object-storage bucket lives → Platform
  (Decision 0010).
