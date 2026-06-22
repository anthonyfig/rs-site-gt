---
id: gt-03-us-ai-offering-overview
title: "US-1 — Offering overview & need→build→outcome"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-ai-offering-hub", "live: /ai-landing"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-ai-offering-hub
related: ["gt-03-capability-ai-offering-hub"]
tags: ["offering", "overview"]
---

# User story: Offering overview & need→build→outcome

**As an** AI buyer **I want** to see Rootstrap's AI offering and what it builds for needs like mine
**so that** I can find the right starting point.

## Acceptance criteria — scenarios
**Scenario: Pillars + product-level framing**
- **Given** I open the AI offering hub
- **Then** I see the four pillars (AI Discovery Sprint · AI Readiness & Architecture · AI Product
  Development · AI Integration) and the framing "AI fails at the product level — most pilots never reach production."

**Scenario: need → build → outcome mapping**
- **Given** the mapping
- **When** I scan "when your product needs to…"
- **Then** I see what Rootstrap builds and the business outcome (from /ai-landing), so I can self-locate.

## Definition of done
- [ ] Scenarios pass · server-rendered · WCAG AA · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Pillars/framing | `EV-SEO-REGRESSION` | content in initial HTML |
| Discoverable | `EV-GEO` | assistants describe the offering accurately |
| A11y | `EV-A11Y` | no blocking violations |

## Notes / human gates
- Final pillar naming → Marketing.
