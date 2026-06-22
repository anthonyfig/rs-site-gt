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
  - "Tooling: HubSpot connector observed (CRM/forms/scheduler)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-05-hubspot", "gt-06-index", "gt-01-audience-and-icp", "gt-02-business-rules"]
tags: ["conversion", "lead", "hubspot"]
tier: "C2"
---

# Capability: Capture & qualify a lead → AI Discovery Sprint

## Purpose
Turn an ICP-fit visitor into a qualified conversation — primarily a booked/loosely-requested
**AI Discovery Sprint** — with the lead landing correctly in HubSpot, attributed and routed. This
is the commercial reason the marketing site exists (`01/goals-and-scope`, goal 3).

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | Submit inquiry / request a sprint / book a slot | See other leads; see internal data (BR-8) |
| Marketing/Sales (HubSpot) | Receive, attribute, route, qualify | — |
| System | Validate input, write to HubSpot, confirm to user | Auto-promise pricing/timeline (human gate) |

## Triggers
Primary CTA "**Start an AI Discovery Sprint**" / "Talk to our AI team"; secondary contact forms.

## Happy path
1. Visitor clicks a Discovery-Sprint CTA.
2. Form (name, work email, company, what they're trying to build, persona-signal) — minimal fields.
3. Client-side + server-side validation; UTM + source captured.
4. Submit → **HubSpot** creates/updates the contact (Integration Contract `05/hubspot`).
5. **Slack notification** fires to the sales channel on the new submission (resilient: a Slack
   failure must never block lead creation).
6. Prospect can **book a call directly** via the **HubSpot Meetings scheduler**
   (`/contact-hubspot-scheduler`) — a booking creates the meeting + calendar invite and notifies Slack.
7. Confirmation state; no false promises about price/timeline.

## Alternate & edge paths
- Scheduler declined → still create the lead; offer async follow-up.
- Returning known contact → update, don't duplicate.
- Low-signal/non-ICP (e.g., student, vendor) → accept but tag; don't route to sales priority.

## Error cases
- HubSpot write fails → queue + retry (idempotent by email); never lose the lead; show graceful state.
- Validation fails → inline, accessible error messaging.
- Spam/bot → server-side checks (no CAPTCHA that blocks accessibility unduly).

## Acceptance criteria
- [ ] AC1 — A valid submission creates exactly one HubSpot contact with source/UTM attribution.
- [ ] AC2 — Failure to reach HubSpot does not lose the lead (durable queue + retry, idempotent).
- [ ] AC3 — No personal data is placed in URLs/query strings; transport is secure.
- [ ] AC4 — Form is keyboard-navigable and screen-reader friendly (WCAG AA).
- [ ] AC5 — Confirmation makes no pricing/timeline promise the business hasn't approved (BR-3/`0003`).
- [ ] AC6 — Persona signal is captured to support A/B/C routing (`01/audience-and-icp`).

## Evals (see Part 06)
| Eval | Type | Golden example | Pass condition |
|------|------|----------------|----------------|
| EV-LEAD-HAPPY | functional | Filled form, valid email | 1 HubSpot contact, correct attribution |
| EV-LEAD-RESILIENCE | regression | HubSpot 500 | lead queued, retried, not lost |
| EV-LEAD-A11Y | a11y | keyboard + SR pass | no blocking violations |
| EV-NO-PII-URL | security | inspect requests | no PII in URL/query |

## Open questions / human gates
- Exact qualification fields & routing rules → Sales (relates to OQ-1 owner).
- Whether Persona C path adds a liquidity-aware flow (BR-9).
