---
id: gt-03-us-lead-scheduling
title: "LEAD-2 · Direct scheduling & Slack notification"
part: "03-capability-specs"
type: user-story
owner: "Head of Sales (suggested) + Platform Architect"
status: draft
delivery_status: in-progress
confidence: medium
sources: ["Capability gt-03-capability-lead-capture", "gt-05-hubspot (Meetings + Slack)"]
updated: 2026-06-24
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-lead-capture
related: ["gt-03-capability-lead-capture", "gt-05-hubspot"]
tags: ["scheduling", "slack", "hubspot"]
---

# User story: Direct scheduling & Slack notification

**As a** prospect **I want** to book a call directly **so that** I don't wait — and the team is
notified instantly.

## Acceptance criteria — scenarios
**Scenario (US-lead-scheduling-AC1): Book directly**
- **Given** the HubSpot Meetings scheduler (`/contact-hubspot-scheduler`)
- **When** I pick a slot
- **Then** a meeting + calendar invite are created.

**Scenario (US-lead-scheduling-AC2): Slack notification**
- **Given** a new submission or booking
- **Then** a Slack notification fires to the sales channel.

**Scenario (US-lead-scheduling-AC3): Notification never blocks capture**
- **Given** Slack is unavailable
- **Then** the lead/booking still succeeds; the notification is retried/logged out of band.

## Definition of done
- [ ] All scenarios pass · scheduler is accessible · no placeholder.

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-LEAD-HAPPY` | meeting + invite created |
| AC2 | `EV-LEAD-HAPPY` | Slack message on submit/booking |
| AC3 | `EV-LEAD-RESILIENCE` | Slack down → lead still created |

## Interim (Decision 0018)
- The contact form captures a **preferred** day/time/timezone (`Meet-Selected-Day`, `Meet-Selected-Hour`,
  `Time-Zone`) submitted with the lead; a principal engineer confirms by email. This is **not** live
  booking — AC1 (real HubSpot Meetings slot + calendar invite) remains **backlog** and currently lives on
  `/contact-hubspot-scheduler`.

## Notes / human gates
- Target Slack channel + HubSpot Meetings link → Sales (`05/hubspot` open questions).
