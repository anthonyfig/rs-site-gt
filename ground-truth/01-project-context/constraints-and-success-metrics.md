---
id: gt-01-constraints-and-success-metrics
title: "Constraints & Success Metrics"
part: "01-project-context"
type: project-context
owner: "Anthony (sponsor) + Head of Marketing"
status: draft
confidence: medium
sources:
  - "live: https://www.rootstrap.com (Webflow) + /contact-hubspot-scheduler (fetched 2026-06-22)"
  - "Tooling observed: HubSpot connector (CRM/forms/analytics), Webflow project 'RS2.0 - MASTER'"
  - "Delivery v2 deck — /sources/ai-native-delivery.html (Jun 2026)"
  - "Notion: AI Delivery Playbook v1.0 (Dec 2025) — evals must be real, not theatre"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-04-index", "gt-05-index"]
tags: ["constraints", "metrics"]
---

# Constraints & Success Metrics

## Constraints

- **Current site is Webflow** (production project **"RS2.0 - MASTER"**). Any migration must
  preserve SEO equity and not strand existing URLs. Decision on keep-vs-migrate marketing CMS is
  [OQ-3](non-goals-and-open-questions.md).
- **HubSpot is the system of record** for CRM, forms, and the contact scheduler
  (`/contact-hubspot-scheduler`). The site captures; HubSpot owns the lead. (See `05`.)
- **Brand is mid-pivot.** Old ("nearshore agency") and new ("AI that ships") messaging coexist
  publicly today; the site must land the new story without discarding hard-won proof.
- **The method must be demonstrably real.** Per the Playbook, "evals have to be real, not
  theater." A site that *claims* AI-native delivery while being a static brochure fails its own thesis.
- **Nearshore, senior-led team** (US/Uruguay/Argentina/Colombia); timezone-aligned to the Americas.
- **Truthfulness:** no placeholder/Lorem-Ipsum content ships. Unknowns become open questions, not filler.

## Success metrics

> Pick metrics we can actually instrument (HubSpot + web analytics). Avoid vanity counts; the
> Delivery v2 deck warns against turning throughput into "the new story points."

**Primary (business outcome)**
- Qualified, ICP-fit pipeline created from the site (HubSpot, tagged by persona A/B/C).
- **AI Discovery Sprint** bookings / qualified conversations.
- Lead → opportunity conversion quality (not just volume).

**Secondary (the site working as intended)**
- Message resonance: scroll/engagement on the positioning + Explorer; qualitative sales feedback.
- Explorer usage: questions asked, traces followed, validations submitted.

**Discoverability**
- SEO: parity-or-better vs. current site on target intents; no ranking regressions post-migration.
- **LLM discovery:** the site is cited/quoted accurately by AI assistants for "AI product
  delivery / AI that reaches production" queries (see `04/seo-and-llm-discovery.md`, `06`).

**Method credibility (leading indicator)**
- The site itself shipped *via* the Blueprint and is maintainable from Ground Truth — usable as a
  reference case in sales.
