---
id: gt-03-us-conversion-tracking
title: "ANALYTICS-2 · Conversion tracking & attribution"
part: "03-capability-specs"
type: user-story
owner: "Head of Sales/Growth (suggested) + Platform Architect"
status: draft
delivery_status: backlog
confidence: medium
sources:
  - "Capability gt-03-capability-analytics-measurement"
  - "gt-05-hubspot (form submit → contact upsert with UTM/source; booking events; idempotent by email)"
  - "gt-01-constraints-and-success-metrics (Discovery Sprint bookings; qualified ICP pipeline)"
  - "gt-03-capability-lead-capture (the lead event this tracks)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-analytics-measurement
related: ["gt-03-capability-analytics-measurement", "gt-05-hubspot", "gt-03-capability-lead-capture", "gt-01-constraints-and-success-metrics"]
tags: ["conversion", "attribution", "utm", "hubspot"]
---

# User story: Conversion tracking & attribution

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

**As a** Growth analyst **I want** the key conversion (Discovery Sprint request / lead) tracked with
its source/UTM and reflected in HubSpot **so that** I can attribute qualified pipeline to what drove
it — accurately, and without leaking personal data.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anonymous) | Trigger the conversion by requesting a Discovery Sprint / submitting a lead | Have PII placed in URLs or analytics payloads |
| Growth analyst | Read conversion counts + source/UTM attribution; map events to `01` metrics | Re-identify individuals from analytics; alter HubSpot as source of truth |
| The system | Fire one conversion event with attribution; forward to HubSpot | Double-count; send internal revenue/deal data (BR-8) |
| HubSpot | Own the resulting contact/booking + pipeline (`05`) | Be bypassed as system of record for leads |

## Preconditions
- The lead/booking flow exists (`gt-03-capability-lead-capture`, `05/hubspot`): form submit → contact upsert (idempotent by email) and direct scheduling → booking.
- Source/UTM parameters are captured at entry and carried to the conversion **without exposing PII**.
- A metric-to-event mapping is agreed: which `01` success metric each tracked event represents.

## Acceptance criteria — scenarios (Given / When / Then)
**Scenario (gt-03-us-conversion-tracking-AC1): Key conversion fires once**
- **Given** a visitor who requests a Discovery Sprint / submits the lead form
- **When** the submission succeeds
- **Then** exactly **one** conversion event is recorded — no double-count on retry or re-render.

**Scenario (gt-03-us-conversion-tracking-AC2): Source/UTM attribution captured**
- **Given** the visitor arrived with UTM/source parameters (or a known referrer/AI-referral)
- **When** the conversion fires
- **Then** the event carries the source/UTM attribution, and that attribution is written to the HubSpot contact (`05`).

**Scenario (gt-03-us-conversion-tracking-AC3): Event reaches HubSpot idempotently**
- **Given** the conversion event
- **When** it is forwarded
- **Then** a HubSpot contact is created/updated idempotently **by email** (no duplicate), matching the `05` form-submit flow.

**Scenario (gt-03-us-conversion-tracking-AC4): Each event maps to a success metric**
- **Given** the tracked events (lead submitted, Discovery Sprint booking)
- **When** reported
- **Then** each maps to a named `01` metric — **Discovery Sprint bookings** and **qualified ICP pipeline** — not a vanity count.

**Scenario (gt-03-us-conversion-tracking-AC5): No PII and no internal data in tracking**
- **Given** the conversion event and its attribution
- **When** recorded/forwarded to analytics or Slack
- **Then** no PII appears in URLs/query strings and no internal revenue/deal-size data is included (BR-8); transport is secure.

## Definition of done
- [ ] All scenarios pass their evals · no PII in URLs (privacy rule) · no internal data (BR-8) · no unapproved pricing/timeline promise (Decision 0003) · no placeholder content (BR-11)

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 | `EV-CONVERSION-EVENT` | exactly one event per successful conversion |
| AC2 | `EV-CONVERSION-EVENT` | source/UTM captured on event + on HubSpot contact |
| AC3 | `EV-LEAD-HAPPY` | HubSpot contact upserted idempotently by email |
| AC4 | `EV-METRIC-MAPPING` | each event maps to a named `01` success metric |
| AC5 | `EV-NO-PII-URL` + `EV-INTERNAL-LEAK` | no PII in URL/query; no internal data forwarded |

## Notes / human gates
- The metric-to-event mapping sign-off and which dashboards Sales/Growth needs → Head of Sales/Growth.
- HubSpot portal ID / form IDs / Meetings link for wiring events → Sales (`05` open questions).
- Whether AI-referral conversions are reliably attributable vs. measured via the GEO eval only → `04`/`06`.
