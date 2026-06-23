---
id: gt-03-us-explorer-validate
title: "EXPLORER-5 · Validate an artifact → clean commit"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Anthony"
status: draft
delivery_status: backlog
confidence: medium
sources:
  - "Capability gt-03-capability-explorer"
  - "Decision 0010 — the Explorer authors a clean commit on the user's behalf; one commit = one validated change = the audit trail + human gate"
  - "rs-ip explorer/SPEC.md (Validate)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
capability: gt-03-capability-explorer
related: ["gt-03-capability-explorer", "gt-07-0010-git-system-of-record-db-engine", "gt-03-us-explorer-health"]
tags: ["explorer", "validate", "commit", "human-gate"]
---

# User story: Validate an artifact → clean commit

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

**As a** validator (internal) **I want** to mark an artifact validated and have the Explorer write a
clean Git commit on my behalf **so that** the model carries trustworthy, audited validation without
my ever touching raw Git.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Validator (internal) | Review an artifact and confirm it validated | Hand-write or push a raw Git commit directly (Decision 0010) |
| Internal user (authenticated, non-validator) | View validation status | Mark an artifact validated |
| Explorer (system) | Author a clean commit on the validator's behalf after explicit confirmation | Commit without explicit human confirmation (human gate) |
| Non-internal user | — | Reach this flow or see any internal-only artifact (BR-8) |

## Preconditions
- The validator is authenticated and has validation rights (Decision 0005).
- Git is the system of record; the Explorer is the only sanctioned write path to it, and it commits
  on the user's behalf (Decision 0010).
- The artifact being validated is open in its detail view (US-1).

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-explorer-validate-AC1): Confirm validation → one clean commit**
- **Given** a validator reviewing an artifact
- **When** they confirm it as validated
- **Then** the Explorer writes **one clean Git commit** that updates the artifact's `last_validated`
  and `validated_by`, and the commit is the audit record of that validation (Decision 0010).

**Scenario (gt-03-us-explorer-validate-AC2): Human gate — explicit confirmation required**
- **Given** a validator viewing an artifact
- **When** no explicit confirmation has been given
- **Then** **no commit is written** — validation never happens automatically.

**Scenario (gt-03-us-explorer-validate-AC3): No raw direct commits**
- **Given** any user of the Explorer
- **When** they use the validate flow
- **Then** they **never** see or perform a raw Git operation; the Explorer authors the commit on
  their behalf (Decision 0010).

**Scenario (gt-03-us-explorer-validate-AC4): One commit = one validated change**
- **Given** a confirmed validation
- **When** the commit is authored
- **Then** it represents exactly **one** validated change with a clean, structured message — not a
  bundle of unrelated edits.

**Scenario (gt-03-us-explorer-validate-AC5): Status reflects after rebuild**
- **Given** a committed validation
- **When** the engine is rebuilt from Git (Decision 0010)
- **Then** the artifact shows as validated (updated `last_validated` / `validated_by`) in the table
  (US-1) and health panel (US-3).

**Scenario (gt-03-us-explorer-validate-AC6): No internal leak**
- **Given** a non-internal user
- **When** they attempt to reach the validate flow
- **Then** they are refused and no internal-only artifact (BR-8) is shown.

## Definition of done
- [ ] All scenarios pass their evals · keyboard- and screen-reader-operable (WCAG AA) ·
  no placeholder content (BR-11) · the write path is Explorer → Git only; no raw commits (Decision 0010).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC2 / AC3 | `EV-HUMAN-GATE` | nothing is committed without explicit confirmation; no raw Git path is exposed |
| AC1 / AC4 | `EV-EXPLORER-VALIDATE` | confirmation yields exactly one clean commit updating `last_validated` / `validated_by` |
| AC5 | `EV-GT-CONSISTENCY` | after rebuild, the engine's validation state matches the committed Git file |
| AC6 | `EV-INTERNAL-LEAK` | no internal-only artifact is served to a non-internal user |
| A11y | `EV-A11Y` | the flow is operable by keyboard and screen reader; no blocking violations |

## Notes / human gates
- The **commit-authoring mechanism** (message format, author identity recorded, branch/PR vs
  direct-to-main) → Platform, consistent with Decision 0010.
- Who holds **validation rights** vs plain internal access → Anthony + Platform.
