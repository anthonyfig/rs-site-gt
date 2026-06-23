---
id: gt-03-us-insights-article
title: "INSIGHT-2 · Article page (SEO + LLM discovery)"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
delivery_status: in-progress
confidence: medium
sources: ["Capability gt-03-capability-insights", "gt-04-seo-and-llm-discovery", "gt-02-business-rules (BR-7/12)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-insights
related: ["gt-03-capability-insights", "gt-04-seo-and-llm-discovery"]
tags: ["insights", "article", "geo"]
---

# User story: Article page (SEO + LLM discovery)

**As a** reader (or AI assistant) **I want** a clean, well-structured article **so that** I learn —
and so the content is accurately citable.

## Acceptance criteria — scenarios
**Scenario: Structured, attributed, discoverable**
- **Given** an article
- **Then** it is server-rendered with author + date (E-E-A-T) and `Article` structured data; headings/definitions/Q&A make it extractable for LLMs.

**Scenario: Accurate claims**
- **Then** any facts/stats are verified (BR-7) and no claim violates BR-12 ("Anthropic partner") or BR-8 (internal data).

## Definition of done
- [ ] Scenarios pass · valid structured data · WCAG AA · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Structured/attributed | `EV-SEO-REGRESSION` | server-rendered + valid structured data |
| Discoverable | `EV-GEO` | assistants quote the article accurately + cite it |
| Accurate | `EV-DATA`, `EV-INTERNAL-LEAK` | verified claims; no internal data |

## Notes / human gates
- Editorial review before publish.
