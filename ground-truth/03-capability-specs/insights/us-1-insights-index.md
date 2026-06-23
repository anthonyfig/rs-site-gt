---
id: gt-03-us-insights-index
title: "INSIGHT-1 · Insights index & filter"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
delivery_status: in-progress
confidence: medium
sources: ["Capability gt-03-capability-insights"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-insights
related: ["gt-03-capability-insights"]
tags: ["insights", "index"]
---

# User story: Insights index & filter

**As a** visitor (or AI crawler) **I want** to browse and filter insights by topic **so that** I can
find relevant thinking quickly.

## Acceptance criteria — scenarios
**Scenario: Server-rendered, filterable index**
- **Given** I open Insights
- **Then** posts render in the initial HTML, filterable by topic, with title/excerpt/date — usable without JS.

**Scenario: Discoverable**
- **Then** the index exposes clean metadata + links so crawlers and LLMs can enumerate the content.

## Definition of done
- [ ] Scenarios pass · server-rendered · WCAG AA · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Index/filter | `EV-SEO-REGRESSION` | posts in initial HTML; filter works |
| Discoverable | `EV-GEO` | assistants can list/cite posts |
| A11y | `EV-A11Y` | no blocking violations |

## Notes / human gates
- Topic taxonomy → Marketing.
