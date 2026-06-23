---
id: gt-03-us-explorer-table
title: "EXPLORER-1 · Browse the Ground Truth in a table"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Anthony"
status: draft
delivery_status: backlog
confidence: medium
sources:
  - "Capability gt-03-capability-explorer"
  - "Decision 0010 — Git is the system of record; the database is the engine"
  - "rs-ip explorer/SPEC.md (Browse/Trace)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
capability: gt-03-capability-explorer
related: ["gt-03-capability-explorer", "gt-03-us-explorer-map", "gt-03-us-explorer-health"]
tags: ["explorer", "browse", "table", "trace"]
---

# User story: Browse the Ground Truth in a table

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

**As an** internal Rootstrap user **I want** to see every Ground Truth artifact in one
sortable, filterable table and open any one to read its metadata and trace it to its sources
**so that** I can manage the model without reading raw files in Git.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Internal user (authenticated) | List, sort, filter, open any artifact; view its metadata and sources | Reach the Explorer if not authenticated; edit by hand-writing raw Git commits (Decision 0010) |
| Validator (internal) | Everything an internal user can; act on an artifact from its view (see US-5) | — |
| Non-internal user | — | Reach the Explorer or see any internal-only artifact at all (BR-8) |

## Preconditions
- The user is authenticated as an internal Rootstrap user (Decision 0005).
- The database engine has been built from the Git repository, so the table reflects the canonical
  text (Decision 0010).
- Each artifact carries its frontmatter: `status`, `owner`, `confidence`, area/part, `last_validated`,
  and `sources`.

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-explorer-table-AC1): The table lists every artifact**
- **Given** I am an authenticated internal user on the Explorer
- **When** the Browse view loads
- **Then** I see a table with **one row per artifact** in the Ground Truth, each row showing at least
  **status, owner, confidence, area, and last-validated**, plus the artifact's title.

**Scenario (gt-03-us-explorer-table-AC2): Sort by a column**
- **Given** the table of artifacts
- **When** I sort by `last-validated` (or by confidence, status, owner, or area)
- **Then** the rows reorder by that column and the active sort is shown.

**Scenario (gt-03-us-explorer-table-AC3): Filter the table**
- **Given** the table of artifacts
- **When** I filter by one or more of status, owner, confidence, or area (e.g. status = `draft`)
- **Then** only matching rows remain, the active filters are visible, and I can clear them.

**Scenario (gt-03-us-explorer-table-AC4): Open an artifact to its metadata + sources (trace)**
- **Given** a row in the table
- **When** I open that artifact
- **Then** I see its full metadata (status, owner, confidence, area, last-validated, related) **and**
  its **sources**, each traceable back to where the claim came from (trace-to-source).

**Scenario (gt-03-us-explorer-table-AC5): Empty filter result**
- **Given** a filter combination that matches no artifacts
- **When** the result set is empty
- **Then** I see a clear empty state with a way to reset filters, not a blank screen.

**Scenario (gt-03-us-explorer-table-AC6): No internal leak**
- **Given** a non-internal user
- **When** they attempt to reach the Browse view or any artifact
- **Then** they are refused and no internal-only artifact (BR-8) is ever returned.

## Definition of done
- [ ] All scenarios pass their evals · keyboard- and screen-reader-operable (WCAG AA) ·
  no placeholder content (BR-11) · the table reflects the Git repository as rebuilt into the engine
  (Decision 0010).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 / AC2 / AC3 / AC5 | `EV-EXPLORER-TABLE` | every artifact has a row with the five columns; sort and filter return correct subsets; empty state shown |
| AC4 | `EV-GT-CONSISTENCY` | the opened artifact's metadata and sources match the canonical Git file |
| AC6 | `EV-INTERNAL-LEAK` | no internal-only artifact is served to a non-internal user |
| A11y | `EV-A11Y` | table is operable by keyboard and screen reader; no blocking violations |

## Notes / human gates
- The exact filter/column taxonomy (area names) should align with `02/entities` → Product.
- Editing from a row is **not** part of this story; changes go through Validate → commit (US-5) and
  Ingest (US-6), never hand-written commits (Decision 0010).
