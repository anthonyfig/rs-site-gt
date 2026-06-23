---
id: gt-03-capability-lead-capture
title: "Capability: Capture & qualify a lead → AI Discovery Sprint"
part: "03-capability-specs"
type: capability-spec
owner: "Head of Sales (suggested) + Product Architect"
status: draft
confidence: medium
sources:
  - "live: /contact + /contact-hubspot-scheduler + /ai-landing CTA 'Start an AI Discovery Sprint' (2026-06-22)"
  - "Notion: ICP & Buyer Persona Report (qualification logic) (May 2026)"
  - "Tooling: HubSpot connector observed (CRM/forms/scheduler) + Slack notifications"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-05-hubspot", "gt-01-audience-and-icp", "gt-02-business-rules"]
tags: ["conversion", "lead", "hubspot"]
tier: "C2"
---

# Capability: Capture & qualify a lead → AI Discovery Sprint

> Human-facing unit of value. Executable detail is in the user stories below (refactored from the
> earlier inline version for consistency with the capability/user-story model — Decision 0007).

## Purpose
Turn an ICP-fit visitor into a qualified conversation — primarily a booked or requested **AI
Discovery Sprint** — with the lead landing correctly in HubSpot, attributed and routed. This is the
commercial reason the marketing site exists (`01/goals-and-scope`, goal 3).

## Actors
Visitor (anon, personas A/B/C) · Marketing/Sales (in HubSpot) · System.

## Outcomes / success
- ICP-fit visitors become attributed HubSpot leads; many self-serve a booked call; sales is notified instantly.

## Scope
**In:** the capture form, direct call scheduling, notifications, and the resilience/privacy guarantees.
**Out:** HubSpot/CRM internals (see `05/hubspot`), the offering content (→ AI offering hub).

## Capability-level acceptance
Satisfied by the sum of the user stories below.
- [ ] A valid submission creates exactly one attributed HubSpot contact; failures never lose the lead.
- [ ] A prospect can book a call directly; sales is notified in Slack (notification never blocks capture).
- [ ] No PII in URLs; accessible (WCAG AA); no pricing/timeline promise the business hasn't approved (Decision 0003).

## User stories (agent-facing)
- [ ] [LEAD-1 · Submit & create an attributed contact](lead-capture/us-1-submit-create-contact.md)
- [ ] [LEAD-2 · Direct scheduling & Slack notification](lead-capture/us-2-scheduling-and-slack.md)
- [ ] [LEAD-3 · Resilience & privacy](lead-capture/us-3-resilience-and-privacy.md)

## Evals
`EV-LEAD-HAPPY`, `EV-LEAD-RESILIENCE`, `EV-LEAD-A11Y`, `EV-NO-PII-URL` (see `06-eval-suite`).

## Open questions / human gates
- Exact qualification fields & routing rules → Sales (relates to OQ-1).
- Whether the Persona C path adds a liquidity-aware flow (BR-9).

## Sources & traceability
Live /contact + scheduler + /ai-landing CTA; ICP Report; HubSpot + Slack tooling (`05/hubspot`).
