---
id: gt-03-us-content-collection
title: "US-3 — Collection browse / filter / detail"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-content-publishing", "gt-02-content-types (Collection, Industry)", "gt-02-business-rules (BR-13)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-content-publishing
related: ["gt-03-capability-content-publishing", "gt-02-content-types"]
tags: ["collection", "filter", "industries"]
---

# User story: Collection browse / filter / detail

**As a** visitor **I want** to browse and filter a collection (e.g., **Industries**) and open a
detail page **so that** I find what's relevant to me.

## Acceptance criteria — scenarios
**Scenario (US-content-collection-AC1): Browse + filter**
- **Given** a collection (Industries)
- **Then** items render server-side, filterable (e.g., by sector); the URL reflects the filter.

**Scenario (US-content-collection-AC2): Detail**
- **When** I open an item
- **Then** its detail content renders; regulated industries surface the trust language (SOC 2, guardrails, audit trails — BR-13).

## Definition of done
- [ ] Scenarios pass · server-rendered · WCAG AA · no placeholder.

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-CS-FILTER`, `EV-SEO-REGRESSION` | correct subset; URL reflects filter; server-rendered |
| AC2 | `EV-A11Y` | detail accessible |

## Notes / human gates
- Collection taxonomies → Marketing.
