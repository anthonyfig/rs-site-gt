---
id: gt-03-us-explorer-health
title: "EXPLORER-3 · See health & gaps in the model"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Anthony"
status: draft
delivery_status: backlog
confidence: medium
sources:
  - "Capability gt-03-capability-explorer"
  - "Decision 0010 — health derives from the Git-backed model via the engine"
  - "rs-ip explorer/SPEC.md (status / health)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
capability: gt-03-capability-explorer
related: ["gt-03-capability-explorer", "gt-03-us-explorer-table", "gt-03-us-explorer-validate"]
tags: ["explorer", "health", "gaps"]
---

# User story: See health & gaps in the model

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

**As an** internal Rootstrap user **I want** a panel that surfaces the model's gaps — what needs
revalidation, what is low-confidence, what is unowned, what is still draft, which capabilities lack
user stories, and the open questions **so that** I can drive validation and ownership from data, not
memory.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Internal user (authenticated) | View the health/gaps panel; jump from any gap to the artifact | Reach the Explorer if not authenticated |
| Non-internal user | — | Reach the panel or see any internal-only artifact (BR-8) |

## Preconditions
- The user is authenticated as an internal Rootstrap user (Decision 0005).
- Health is computed from the Git-backed model via the engine (Decision 0010): frontmatter such as
  `status`, `confidence`, `owner`, `last_validated`, capability→story links, and the open-questions
  list.

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-explorer-health-AC1): Needs revalidation**
- **Given** artifacts with a `last_validated` that is `pending` or stale by the model's freshness rule
- **When** I open the health panel
- **Then** I see a **needs-revalidation** group listing exactly those artifacts.

**Scenario (gt-03-us-explorer-health-AC2): Low confidence**
- **Given** artifacts whose `confidence` is low
- **When** I open the health panel
- **Then** I see a **low-confidence** group listing exactly those artifacts.

**Scenario (gt-03-us-explorer-health-AC3): Unowned (owner pending/suggested)**
- **Given** artifacts whose `owner` is pending or only suggested
- **When** I open the health panel
- **Then** I see an **unowned** group listing exactly those artifacts.

**Scenario (gt-03-us-explorer-health-AC4): Still draft**
- **Given** artifacts whose `status` is `draft`
- **When** I open the health panel
- **Then** I see a **still-draft** group listing exactly those artifacts.

**Scenario (gt-03-us-explorer-health-AC5): Capabilities lacking user stories**
- **Given** a capability spec with no linked user stories
- **When** I open the health panel
- **Then** I see a **capabilities-without-stories** group listing exactly those capabilities.

**Scenario (gt-03-us-explorer-health-AC6): Open questions**
- **Given** artifacts that record open questions / human gates
- **When** I open the health panel
- **Then** I see an **open-questions** group surfacing them.

**Scenario (gt-03-us-explorer-health-AC7): Jump to the artifact**
- **Given** any item listed in any group
- **When** I select it
- **Then** I land on that artifact's detail view (US-1).

**Scenario (gt-03-us-explorer-health-AC8): No internal leak**
- **Given** a non-internal user
- **When** they attempt to reach the panel
- **Then** they are refused and no internal-only artifact (BR-8) is ever shown.

## Definition of done
- [ ] All scenarios pass their evals · keyboard- and screen-reader-operable (WCAG AA) ·
  no placeholder content (BR-11) · groups are computed from the canonical Git model (Decision 0010).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1–AC6 | `EV-EXPLORER-HEALTH` | each group lists exactly the artifacts matching its rule, with no false positives or omissions |
| AC1–AC6 | `EV-GT-CONSISTENCY` | the groups match what the canonical Git model implies |
| AC7 | `EV-EXPLORER-HEALTH` | selecting a listed item opens the correct artifact |
| AC8 | `EV-INTERNAL-LEAK` | no internal-only artifact is served to a non-internal user |
| A11y | `EV-A11Y` | panel is operable by keyboard and screen reader; no blocking violations |

## Notes / human gates
- The exact **freshness rule** for "stale" (how old `last_validated` may be) → Product + Anthony.
- The health panel **reports** gaps; closing them happens through Validate → commit (US-5) and Ingest
  (US-6) — the panel itself never edits the model.
