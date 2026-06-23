---
id: gt-03-capability-analytics-measurement
title: "Capability: Analytics & Measurement"
part: "03-capability-specs"
type: capability-spec
owner: "Head of Sales/Growth (suggested)"
status: draft
confidence: medium
sources:
  - "Decision 0012 (capability identification + abstraction levels)"
  - "gt-01-constraints-and-success-metrics (the metrics this must measure)"
  - "gt-05-hubspot (lead/booking events → HubSpot; Slack notifications)"
  - "gt-04-seo-and-llm-discovery (GEO/SEO measurement; AI-referral traffic)"
  - "Observed tooling: GTM container GTM-K48G3TB; HubSpot connector in workspace"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-01-constraints-and-success-metrics", "gt-05-hubspot", "gt-04-seo-and-llm-discovery", "gt-03-capability-lead-capture", "gt-03-index"]
tags: ["analytics", "measurement", "privacy", "hubspot", "conversion"]
tier: "C1"
---

# Capability: Analytics & Measurement

> Human-facing unit of value. Executable detail is in the two user stories linked below.
> This is a **function**: measure whether the site achieves its goals — privately and accurately.

## Purpose
Instrument the site so we can answer one question honestly: **is it working?** That means measuring
the success metrics in `01/constraints-and-success-metrics` — qualified ICP pipeline, AI Discovery
Sprint bookings, message resonance, and SEO/LLM discoverability — **without leaking personal data**.
Measurement here is a credibility test, not a vanity exercise: a site that claims AI-native delivery
must measure itself with the same rigor it sells, and it must do so privately by default.

## Actors
Visitor (anonymous, ICP personas A/B/C; gives or withholds consent) ·
Marketing/Growth analyst (reads dashboards, ties events to metrics) ·
Sales (consumes pipeline attribution from HubSpot) ·
the system (page/engagement analytics, GTM, server-side event forwarding) ·
HubSpot (system of record for the lead/booking events the site reports).

## Outcomes / success
- We can see **qualified, ICP-fit pipeline** and **Discovery Sprint bookings** attributed to source/UTM — in HubSpot, the system of truth (`05`).
- We can see **message resonance** (engagement on the positioning + Explorer) and **discoverability** (organic + AI-referral traffic) without guessing.
- Every metric on a dashboard maps to a real success metric in `01` — **no vanity counts**.
- The visitor's privacy is respected: **no PII in URLs**, non-essential tracking is **off until consent**, and the approach is cookie-light by default.

## Scope
**In:** privacy-respecting page/engagement analytics, consent handling, conversion tracking for the
key lead/booking event, source/UTM attribution, and forwarding those events to HubSpot.
**Out:** the CRM and pipeline reporting itself (HubSpot owns it, `05`); the lead-capture form
mechanics (`gt-03-capability-lead-capture`); internal revenue/deal-size analytics (BR-8); the
GEO/SEO content strategy (`04` defines it — this capability only measures it).

## Capability-level acceptance
- [ ] Key events instrumented via **GTM** (`GTM-K48G3TB`) + HubSpot; HubSpot stays system-of-truth for leads/bookings (`05`).
- [ ] **No PII in URLs/query strings** anywhere analytics touches (BR privacy rule, eval `EV-NO-PII-URL`).
- [ ] **Consent before non-essential tracking:** non-essential cookies/trackers are declined by default; the visitor opts in.
- [ ] The **key conversion** (Discovery Sprint request / lead) is tracked with **source/UTM attribution** and reaches HubSpot idempotently (`05`).
- [ ] Each tracked event **maps to a named success metric** in `01`; reports tie to those metrics, not vanity counts.
- [ ] Analytics is **cookie-light** and accessible; consent UI is keyboard/screen-reader usable (WCAG AA) and never blocks content.
- [ ] **No internal data** (revenue, deal size, anti-ICP signals) is ever sent to analytics or Slack (BR-8).

## User stories (agent-facing)
- [ ] [US-1 — Privacy-respecting analytics](us-1-privacy-respecting-analytics.md)
- [ ] [US-2 — Conversion tracking & attribution](us-2-conversion-tracking.md)

## Evals
`EV-NO-PII-URL` (no personal data in URLs/query strings), `EV-CONSENT-DEFAULT` (non-essential
tracking off until opt-in), `EV-CONVERSION-EVENT` (key conversion fires once with attribution and
reaches HubSpot), `EV-METRIC-MAPPING` (each event maps to a `01` success metric), plus shared
`EV-INTERNAL-LEAK` and `EV-A11Y` (see `06-eval-suite`).

## Open questions / human gates
- Consent/cookie approach and the exact analytics tool (cookie-light vendor vs. HubSpot-native) → Marketing + Platform Architect.
- Which dashboards Sales/Growth actually need, and the metric-to-event mapping sign-off → Head of Sales/Growth.
- HubSpot portal ID / form IDs / Meetings link for event wiring → Sales (`05` open questions).
- Whether AI-referral traffic is reliably attributable, or measured via the GEO eval only → `04`/`06`.

## Sources & traceability
Success metrics (`01/constraints-and-success-metrics`), HubSpot/Slack event flows (`05/hubspot`),
GEO/SEO measurement (`04/seo-and-llm-discovery`), Decision 0012, observed GTM container `GTM-K48G3TB`.
