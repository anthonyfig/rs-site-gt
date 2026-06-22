---
id: gt-03-us-home-trust-proof-bar
title: "US-2 — Trust & proof bar"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-home-positioning", "gt-02-entities (proof points)", "gt-02-business-rules (BR-7/8/12/13)", "Rootstrap Overview June 2026"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-home-positioning
related: ["gt-03-capability-home-positioning", "gt-02-entities", "gt-02-business-rules"]
tags: ["home", "trust", "proof", "claims"]
---

# User story: Trust & proof bar

**As a** visitor **I want** a trust/proof bar **so that** I quickly believe Rootstrap is credible
and safe to bet on.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | See proof points + trust signals | See internal financials |

## Preconditions
- Verified proof points (BR-7) and approved trust signals exist in the Ground Truth.

## Acceptance criteria — scenarios
**Scenario: Accurate, verified stats**
- **Given** the proof bar
- **Then** it shows only **verified** numbers (e.g., 750+ launches, 180+ team, 14 years, 85% retention, 1000+ design sprints, 5 $1B+ startups) — and **no internal financials** (BR-7, BR-8).

**Scenario: Exact trust wording**
- **Then** it shows **"SOC 2 certified"** and **"Anthropic-certified teams"**, plus awards (Inc 5000 · Financial Times · LA Business Journal · Clutch · Great Place to Work)
- **And** it **never** claims "Anthropic partner" (BR-12).

## Definition of done
- [ ] Scenarios pass · no unverified or internal numbers · exact Anthropic/SOC2 wording · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Verified stats | `EV-DATA` | only verified numbers render |
| No internal data | `EV-INTERNAL-LEAK` | 0 internal figures |
| Claim wording | (guardian) `EV-GT-CONSISTENCY` BR-12 check | no "Anthropic partner" |

## Notes / human gates
- Logo usage rights per client (Marketing/legal).
