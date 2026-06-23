---
id: gt-03-us-lead-submit
title: "LEAD-1 · Submit & create an attributed contact"
part: "03-capability-specs"
type: user-story
owner: "Head of Sales (suggested)"
status: draft
delivery_status: in-progress
confidence: medium
sources: ["Capability gt-03-capability-lead-capture", "gt-05-hubspot", "gt-01-audience-and-icp"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-lead-capture
related: ["gt-03-capability-lead-capture", "gt-05-hubspot"]
tags: ["lead", "form", "hubspot"]
---

# User story: Submit & create an attributed contact

**As a** visitor **I want** to submit an inquiry / request a Discovery Sprint **so that** I start a
conversation — landing as one attributed HubSpot contact.

## Acceptance criteria — scenarios
**Scenario (US-lead-submit-AC1): Happy path**
- **Given** the capture form (name, work email, company, what they're building, persona signal)
- **When** I submit valid input
- **Then** exactly **one** HubSpot contact is created/updated, with UTM/source + persona signal captured.

**Scenario (US-lead-submit-AC2): Returning contact — no duplicate**
- **Given** a known email
- **When** it submits again
- **Then** the existing contact is updated, not duplicated.

**Scenario (US-lead-submit-AC3): Validation**
- **Given** invalid input
- **Then** I see inline, accessible error messaging; nothing is sent.

## Definition of done
- [ ] All scenarios pass · WCAG AA · no placeholder · no pricing promise (Decision 0003).

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-LEAD-HAPPY` | 1 contact, correct attribution + persona |
| AC2 | `EV-LEAD-HAPPY` | no duplicate on repeat |
| AC3 | `EV-LEAD-A11Y` | accessible inline errors |

## Notes / human gates
- Exact fields + routing → Sales.
