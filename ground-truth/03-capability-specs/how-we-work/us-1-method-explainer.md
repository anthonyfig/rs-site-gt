---
id: gt-03-us-how-we-work-method-explainer
title: "US-1 — The method, explained plainly"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-how-we-work", "Delivery v2 deck", "gt-02-vocabulary"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-how-we-work
related: ["gt-03-capability-how-we-work", "gt-02-vocabulary"]
tags: ["method", "explainer"]
---

# User story: The method, explained plainly

**As a** (technical) visitor **I want** a clear explanation of how Rootstrap delivers **so that** I
understand the method and why it's reliable — without needing the jargon.

## Acceptance criteria — scenarios
**Scenario: The flow, in plain language**
- **Given** I open "How we work"
- **Then** I see the flow **Knowledge → Ground Truth → Specs → Agents → Software**, plus reusable
  loops and human gates, explained in business-readable language with a simple diagram.

**Scenario: Evals + human gates are explicit**
- **Then** it's clear that agents **surface decisions to humans** (gates) and that an **independent
  eval** verifies the work (the fix agent never verifies itself).

## Definition of done
- [ ] Scenarios pass · understandable by a non-technical reader · server-rendered · WCAG AA · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Flow explained | `EV-SEO-REGRESSION` | content in initial HTML |
| Discoverable | `EV-GEO` | assistants can summarize the method accurately |
| A11y | `EV-A11Y` | no blocking violations |

## Notes / human gates
- Depth of method detail to expose publicly → Sponsor.
