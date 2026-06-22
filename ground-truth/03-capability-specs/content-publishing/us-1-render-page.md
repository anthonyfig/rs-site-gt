---
id: gt-03-us-content-render
title: "US-1 — Render any page/collection (server-side, structured, accessible)"
part: "03-capability-specs"
type: user-story
owner: "Platform Architect (suggested)"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-content-publishing", "gt-04-seo-and-llm-discovery", "gt-02-business-rules"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-content-publishing
related: ["gt-03-capability-content-publishing", "gt-04-seo-and-llm-discovery"]
tags: ["rendering", "seo", "a11y"]
---

# User story: Render any page/collection

**As a** visitor (or AI crawler) **I want** any page to render correctly **so that** I can read it
and it's discoverable.

## Acceptance criteria — scenarios
**Scenario (US-content-render-AC1): Server-rendered + structured data**
- **Given** any page/collection
- **Then** its critical content is in the initial server-rendered HTML, with valid schema.org structured data, and it's keyboard/screen-reader operable (WCAG AA).

**Scenario (US-content-render-AC2): Truthful, no placeholder**
- **Then** no Lorem/placeholder content ships (BR-11); claims are verified (BR-7); no internal data appears (BR-8).

## Definition of done
- [ ] Both scenarios pass on every template · Core Web Vitals not regressed.

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-SEO-REGRESSION`, `EV-A11Y` | content in HTML + valid structured data; 0 a11y blockers |
| AC2 | `EV-NO-PLACEHOLDER`, `EV-DATA`, `EV-INTERNAL-LEAK` | 0 placeholders; verified claims; 0 internal data |

## Notes / human gates
- This is the baseline AC every page inherits.
