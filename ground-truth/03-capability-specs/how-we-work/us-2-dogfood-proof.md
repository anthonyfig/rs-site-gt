---
id: gt-03-us-how-we-work-dogfood-proof
title: "US-2 — Proof we use it (dogfood)"
part: "03-capability-specs"
type: user-story
owner: "Anthony (sponsor) + Head of Marketing"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-how-we-work", "Rootstrap Overview June 2026 (uses AI internally; Claude Code/UIPilot)", "gt-02-business-rules (BR-8/12/13)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-how-we-work
related: ["gt-03-capability-how-we-work", "gt-02-business-rules"]
tags: ["dogfood", "proof", "claims"]
---

# User story: Proof we use it (dogfood)

**As a** visitor **I want** proof Rootstrap actually uses this method **so that** I trust it's real,
not theater.

## Acceptance criteria — scenarios
**Scenario: The dogfood**
- **Given** the page
- **Then** it shows that **this very website and its Ground Truth were built with the Blueprint**,
  and that **senior engineers review and validate all agent output** (AI accelerates; humans own quality).

**Scenario: Accurate tooling & trust claims**
- **Then** it may state Rootstrap builds with tools like **Claude Code / UIPilot**, is **SOC 2
  certified**, and has **Anthropic-certified teams** — and it **never** claims "Anthropic partner"
  (BR-12); no internal data appears (BR-8).

## Definition of done
- [ ] Scenarios pass · every claim accurate · no internal data · server-rendered · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Claims accurate | `EV-DATA` | verified claims only |
| No internal data | `EV-INTERNAL-LEAK` | 0 internal figures |
| Anthropic wording | (guardian) `EV-GT-CONSISTENCY` BR-12 | no "Anthropic partner" |

## Notes / human gates
- Confirm which internal tooling is OK to name publicly → Sponsor.
