---
id: gt-03-us-ai-discovery-sprint
title: "US-2 — AI Discovery Sprint detail"
part: "03-capability-specs"
type: user-story
owner: "Head of Sales (suggested) + Head of Marketing"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-ai-offering-hub", "Rootstrap Overview June 2026 (Discovery Sprint 2–6 wks)", "Decision 0003 (no pricing reconciliation)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-ai-offering-hub
related: ["gt-03-capability-ai-offering-hub", "gt-03-capability-lead-capture"]
tags: ["discovery-sprint", "conversion"]
---

# User story: AI Discovery Sprint detail

**As an** AI buyer **I want** the AI Discovery Sprint explained **so that** I understand the
low-risk first step and can start one.

## Acceptance criteria — scenarios
**Scenario: What the Sprint delivers**
- **Given** the page
- **Then** it explains the **AI Discovery Sprint (2–6 weeks)**: data-readiness map, architecture
  recommendation, evaluation framework, and risk register — "clarity before commitment," **before**
  any development spend.

**Scenario: Start a Sprint (CTA → lead)**
- **When** I click "Start an AI Discovery Sprint"
- **Then** I enter the lead-capture flow (`gt-03-capability-lead-capture`).

## Definition of done
- [ ] Scenarios pass · **no pricing claims** (Decision 0003) · CTA reaches lead capture · WCAG AA · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Sprint detail | `EV-SEO-REGRESSION` | content in initial HTML |
| CTA → lead | `EV-LEAD-HAPPY` | reaches lead capture |
| A11y | `EV-A11Y` | no blocking violations |

## Notes / human gates
- Any commercial terms beyond "clarity before commitment" → Sales (pricing is out of scope here, Decision 0003).
