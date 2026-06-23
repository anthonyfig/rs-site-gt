---
id: gt-03-us-case-study-browse-filter
title: "CASE-1 · Browse & filter case studies"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
delivery_status: backlog
confidence: medium
sources: ["Capability gt-03-capability-case-study-showcase", "Notion: ICP & Buyer Persona Report (May 2026)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-case-study-showcase
related: ["gt-03-capability-case-study-showcase", "gt-01-audience-and-icp"]
tags: ["case-studies", "filter"]
---

# User story: Browse & filter case studies

> Agent-facing. Implement against these scenarios; an independent eval verifies them.

**As a** visitor (ICP persona A/B/C) **I want** to browse and filter case studies by industry and
persona **so that** I quickly find proof relevant to me.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | Browse, filter, open a study | See unpublished/internal data |

## Preconditions
- Published case studies exist with `industry` and `persona-fit` tags; the six featured first (OQ-5).

## Acceptance criteria — scenarios
**Scenario: Featured first (server-rendered)**
- **Given** I open the work/case-studies page
- **When** it loads
- **Then** the six featured studies render in the initial HTML (no JS required to read them).

**Scenario: Filter by industry**
- **Given** studies across industries
- **When** I select "Healthcare"
- **Then** only healthcare studies show **and** the URL reflects the filter (deep-linkable/shareable).

**Scenario: Filter by persona**
- **Given** studies tagged by persona-fit
- **When** I select "Scaling Tech Executive"
- **Then** only studies mapped to that persona show.

**Scenario: Empty state**
- **Given** a filter combination with no matches
- **When** results are empty
- **Then** I see a helpful empty state with a reset, not a blank screen.

## Definition of done
- [ ] All scenarios pass · keyboard + screen-reader operable (WCAG AA) · list is server-rendered (SEO/LLM) · no placeholder content.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Featured / filters / empty | `EV-CS-FILTER` | correct subset; URL reflects filter; empty state shown |
| A11y | `EV-A11Y` | no blocking violations |
| Server-rendered | `EV-SEO-REGRESSION` | list present in initial HTML |

## Notes / human gates
- Which industries/personas are the canonical filter taxonomy → Marketing (align with `02/entities`).
