---
id: gt-03-us-lead-resilience
title: "LEAD-3 · Resilience & privacy"
part: "03-capability-specs"
type: user-story
owner: "Platform Architect (suggested)"
status: draft
delivery_status: backlog
confidence: medium
sources: ["Capability gt-03-capability-lead-capture", "gt-05-hubspot", "gt-02-business-rules (BR-8), Decision 0003"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-lead-capture
related: ["gt-03-capability-lead-capture", "gt-05-hubspot", "gt-02-business-rules"]
tags: ["resilience", "privacy", "a11y"]
---

# User story: Resilience & privacy

**As** the business **I want** lead capture to be resilient and private **so that** no lead is lost
and no data leaks.

## Acceptance criteria — scenarios
**Scenario (US-lead-resilience-AC1): HubSpot failure never loses a lead**
- **Given** HubSpot returns an error
- **When** a lead submits
- **Then** the lead is queued and retried (idempotent by email); the user sees a graceful state.

**Scenario (US-lead-resilience-AC2): No PII in URLs**
- **Then** no personal data appears in URLs/query strings; transport is secure.

**Scenario (US-lead-resilience-AC3): No unapproved promise; spam handled accessibly**
- **Then** the confirmation makes no pricing/timeline promise (Decision 0003); spam/bot checks are server-side and don't block accessibility.

## Definition of done
- [ ] All scenarios pass · WCAG AA · no internal data (BR-8) · no placeholder.

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-LEAD-RESILIENCE` | lead queued + retried, not lost |
| AC2 | `EV-NO-PII-URL` | no PII in URL/query |
| AC3 | `EV-LEAD-A11Y` | accessible; no blocking CAPTCHA |

## Notes / human gates
- Queue/retry mechanism choice → Platform Architect.
