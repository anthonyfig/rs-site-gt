---
id: gt-03-us-explorer-decisions
title: "EXPLORER-7 · Track decisions & propose a new one (compose-to-export)"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Anthony"
status: draft
delivery_status: shipped
confidence: medium
sources:
  - "Capability gt-03-capability-explorer"
  - "User direction (Jun 2026): give the client a place inside the Explorer to make product decisions and track everything"
  - "Decision 0010 — Git is the system of record; the Explorer commits behind a human gate"
  - "Decision 0017 — compose-to-export now; live write-back deferred"
  - "Reference impl (Jun 2026): Decisions view in rs-site-gt/tools/ground-truth/build-explorer.mjs"
updated: 2026-06-24
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
capability: gt-03-capability-explorer
related: ["gt-03-capability-explorer", "gt-07-0010-git-system-of-record-db-engine", "gt-07-0017-explorer-chat-backend-supabase-vercel", "gt-03-us-explorer-validate"]
tags: ["explorer", "decisions", "adr", "human-gate"]
---

# User story: Track decisions & propose a new one (compose-to-export)

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

> **Shipped — workspace slice (Jun 2026):** the Explorer has a **Decisions** section: a tracked board
> of every decision (number, title, status, owner, date, what it affects), an **open-questions /
> human-gates** panel, and a **Propose a decision** composer that outputs a schema-valid,
> commit-ready `07-decision-log/NNNN-*.md` file.

> **Shipped — decide slice (Jun 2026):** the board now lets an internal user **Approve / Request
> changes / Reject** with a Claude **recommendation grounded in the model** (plus follow-ups), an
> **Assigned to me** filter, and a **pending badge** in the menu. The outcome **commits back to the
> decision file** via `/api/decide` (Decision 0019) — the Explorer authors a clean commit on the
> user's behalf, so Git stays the source of truth (the decision-flavored realization of US-5).

**As an** internal Rootstrap user (with the client) **I want** to see every product decision tracked
in one place and capture a new decision from inside the Explorer **so that** decisions are recorded
with status, ownership, and provenance — and nothing important lives only in someone's memory.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Internal user (authenticated) | Browse the decision board; open any decision; compose a new decision and export the file | Silently write to Git from the composer (export → human commit; Decision 0010) |
| Validator (internal) | Commit the exported decision file (via US-5's gated path) | Bypass review |
| Non-internal user | — | Reach the workspace or see internal-only decisions (BR-8) |

## Preconditions
- The user is in the authenticated Explorer (Decision 0005).
- The decision board reads from the Git-rebuilt model (Decision 0010); decisions are `type: decision`
  artifacts in `07-decision-log/`.

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-explorer-decisions-AC1): Every decision is tracked**
- **Given** the Decisions view
- **When** it renders
- **Then** it lists **every** decision artifact with its number, title, status, owner, date, and what
  it affects — sortable/openable, each one click from its full page.

**Scenario (gt-03-us-explorer-decisions-AC2): Open questions are surfaced**
- **Given** the Decisions view
- **When** it renders
- **Then** it surfaces **open questions / human gates** and any decisions **awaiting approval**
  (status draft / in-review / needs-revalidation), so what still needs a human is visible.

**Scenario (gt-03-us-explorer-decisions-AC3): Propose → schema-valid, commit-ready file**
- **Given** a user composing a new decision
- **When** they generate it
- **Then** the output is a **schema-valid** `07-decision-log/NNNN-*.md` (correct frontmatter, the next
  free number, sources, status) that **passes `EV-GT-CONSISTENCY`** when committed.

**Scenario (gt-03-us-explorer-decisions-AC4): No silent writes (human gate)**
- **Given** a generated decision file
- **When** the composer finishes
- **Then** nothing is committed automatically — the user reviews and commits (Decision 0010); the
  composer only **produces the file**.

**Scenario (gt-03-us-explorer-decisions-AC5): No internal leak**
- **Given** a non-internal user
- **When** they attempt to reach the workspace
- **Then** they are refused and no internal-only decision (BR-8) is shown.

## Definition of done
- [ ] All scenarios pass their evals · keyboard- and screen-reader-operable (WCAG AA) · no
  placeholder content (BR-11) · exported files conform to `_schema/metadata-schema.md` and Git stays
  the system of record (Decision 0010).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 / AC2 | `EV-EXPLORER-DECISIONS` | board lists all decision artifacts; open-questions and awaiting-approval panels populate from the model |
| AC3 | `EV-GT-CONSISTENCY` | a composed file parses with complete, valid metadata and a unique next id |
| AC4 | `EV-HUMAN-GATE` | the composer never writes to Git; output is a file for human commit |
| AC5 | `EV-INTERNAL-LEAK` | no internal-only decision is served to a non-internal user |
| A11y | `EV-A11Y` | the workspace is operable by keyboard and screen reader; no blocking violations |

## Notes / human gates
- Whether to also let the composer open a **PR automatically** (vs. copy-and-commit) → tie to US-5's
  commit mechanism + Decision 0017.
- Whether **clients** (not just internal staff) may author decisions, and how that squares with the
  internal-only rule (Decision 0005) → Anthony.
