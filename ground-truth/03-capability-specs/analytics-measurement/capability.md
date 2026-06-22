---
id: gt-03-capability-analytics
title: "Capability: Analytics & Measurement"
part: "03-capability-specs"
type: capability-spec
owner: "Head of Sales/Growth (suggested)"
status: draft
confidence: medium
sources: ["Decision 0012", "gt-01-constraints-and-success-metrics", "gt-05-index (HubSpot/GTM)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-01-constraints-and-success-metrics", "gt-05-index", "gt-03-index"]
tags: ["analytics", "measurement", "hubspot"]
tier: "C1"
---

# Capability: Analytics & Measurement

> A **function**: measure the site against its success metrics, privately.

## Purpose
Instrument the site so we can see qualified pipeline, Discovery-Sprint conversions, message
resonance, and SEO/GEO performance — the metrics in `01/constraints-and-success-metrics`.

## Capability-level acceptance
- [ ] Key events instrumented (HubSpot + GTM, `GTM-K48G3TB`); HubSpot stays system-of-truth for leads (`05`).
- [ ] **No PII in URLs/query strings**; privacy-respecting (consent before non-essential tracking).
- [ ] Reports tie to the defined success metrics (not vanity counts).

## User stories
Just-in-time (e.g., "lead attribution", "Discovery-Sprint funnel", "GEO citation tracking").

## Evals
`EV-NO-PII-URL`, plus measurement-validity checks (to register).

## Open questions / human gates
- Consent/cookie approach; which dashboards Sales needs.
