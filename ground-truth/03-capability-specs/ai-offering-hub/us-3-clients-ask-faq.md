---
id: gt-03-us-ai-clients-ask-faq
title: "US-3 — \"What clients ask\" FAQ"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-ai-offering-hub", "Rootstrap Overview June 2026 (What Clients Usually Ask)", "gt-04-seo-and-llm-discovery", "gt-02-business-rules (BR-12)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-ai-offering-hub
related: ["gt-03-capability-ai-offering-hub", "gt-04-seo-and-llm-discovery", "gt-02-business-rules"]
tags: ["faq", "objection-handling", "llm-discovery"]
---

# User story: "What clients ask" FAQ

**As an** AI buyer **I want** straight answers to common concerns **so that** I can trust Rootstrap
— and these double as ideal **LLM-discovery** Q&A.

## Acceptance criteria — scenarios
**Scenario: The three real questions, answered**
- **Given** the FAQ
- **Then** it answers, accurately (from the June 2026 Overview):
  1. *Will we be locked in?* → "You own the code, infrastructure, and data. We build in your environment from day one."
  2. *Do you actually use AI internally?* → "Yes — across development, testing, and delivery, with full engineering review and QA."
  3. *Will AI reduce costs?* → "AI reduces coding time but increases the importance of architecture, evaluation, and reliability — we use it to deliver more value, not lower-quality output."

**Scenario: Accurate + discoverable**
- **Then** answers carry no false claims (BR-12 — never "Anthropic partner") and are marked up as `FAQPage` structured data for search + LLM discovery.

## Definition of done
- [ ] Scenarios pass · accurate claims · structured data valid · WCAG AA · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Answers accurate | `EV-DATA` | claims verified |
| Discoverable | `EV-GEO` | assistants quote answers accurately + cite us |
| Claim wording | (guardian) `EV-GT-CONSISTENCY` BR-12 | no "Anthropic partner" |

## Notes / human gates
- Final FAQ list + wording → Marketing/Sales.
