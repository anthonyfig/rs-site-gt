---
id: gt-03-us-home-hero-narrative
title: "US-1 — Agentic-first hero & value"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-home-positioning", "Delivery v2 deck", "gt-01-goals-and-scope (agentic north star)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-home-positioning
related: ["gt-03-capability-home-positioning", "gt-02-vocabulary"]
tags: ["home", "hero", "positioning"]
---

# User story: Agentic-first hero & value

**As a** visitor **I want** an immediately clear, agentic-first hero and value line **so that** I
understand what Rootstrap is and why it's different within seconds.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | Read the hero; click the CTA | — |

## Preconditions
- Approved positioning copy (agentic-first) exists in the Ground Truth.

## Acceptance criteria — scenarios
**Scenario: Agentic-first, server-rendered**
- **Given** I land on the home page
- **When** it loads
- **Then** the hero leads with the AI-native/agentic value (Ground Truth → AI that reaches production), present in the initial server-rendered HTML and scannable — and "nearshore software agency" is **not** the headline.

**Scenario: Heritage as proof, not the lede**
- **Given** the credibility points (14 years, 750+ launches, named logos)
- **Then** they appear as *support* beneath the agentic message, not as the primary claim.

## Definition of done
- [ ] Scenarios pass · server-rendered (SEO/LLM) · WCAG AA · no placeholder content (BR-11).

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Agentic-first / server-rendered | `EV-SEO-REGRESSION` | hero value in initial HTML |
| Discoverable | `EV-GEO` | assistants describe Rootstrap as AI-native/agentic |
| A11y | `EV-A11Y` | no blocking violations |

## Notes / human gates
- Exact hero wording → Marketing (don't invent claims; BR-7/10).
