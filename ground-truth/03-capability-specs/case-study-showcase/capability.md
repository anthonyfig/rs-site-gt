---
id: gt-03-capability-case-study-showcase
title: "Capability: Case-study showcase"
part: "03-capability-specs"
type: capability-spec
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources:
  - "Notion: ICP & Buyer Persona Report (May 2026) — proof must be ICP-shaped"
  - "rootstrapedia: wiki/case-studies, wiki/projects (Apr 2026)"
  - "Decisions 0007 (specs/stories), 0008 (media/ingest); OQ-5 (lead case studies)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-01-audience-and-icp", "gt-02-entities", "gt-03-index", "gt-07-0008-ground-truth-database-backed-and-media"]
tags: ["proof", "case-studies", "media"]
tier: "C2"
---

# Capability: Case-study showcase

> Human-facing unit of value. Executable detail is in the three user stories linked below.

## Purpose
Turn Rootstrap's strongest, ICP-shaped engagements into credible, scannable proof — dynamic and
filterable, rich with real media and verified outcomes — so a skeptical product/eng leader believes
the method before they ever talk to sales.

## Actors
Visitor (anonymous, ICP personas A/B/C) · Marketing editor (curates, uploads materials) ·
Ingest agent (classifies uploads, proposes placement) · the system.

## Outcomes / success
- Visitors find proof relevant to *their* industry/role in seconds.
- Each case study reads problem → approach → outcome, with metrics and media.
- Editors maintain it **without engineering** (upload + validate).

## Scope
**In:** listing, filtering, rich detail pages, and uploading/placing case-study materials.
**Out:** the CRM (HubSpot), the insights/blog, internal financials.

## Capability-level acceptance
- [ ] Leads with the six confirmed studies (OQ-5): MasterClass · The Farmer's Dog · Madison Reed · Emeritus · BetterUp · Door Space.
- [ ] Filterable by **industry** and **persona**; usable with keyboard/screen-reader (WCAG AA).
- [ ] Every published metric is verified (BR-7); **no internal financials** appear (BR-8).
- [ ] Detail pages carry media (image/video) and structured data for SEO/LLM discovery.
- [ ] Editors can upload materials and publish via a **human gate** — no engineering, no auto-publish.

## User stories (agent-facing)
- [ ] [CASE-1 · Browse & filter case studies](us-1-browse-and-filter.md)
- [ ] [CASE-2 · Rich case-study detail with media](us-2-detail-with-media.md)
- [ ] [CASE-3 · Upload case-study materials (intelligent ingest)](us-3-upload-materials-ingest.md)

## Evals
`EV-CS-FILTER`, `EV-CS-DETAIL`, `EV-INGEST-PLACEMENT`, plus shared `EV-DATA`, `EV-INTERNAL-LEAK`,
`EV-A11Y`, `EV-SEO-REGRESSION` (see `06-eval-suite`).

## Open questions / human gates
- Which media + which metrics are cleared for public use per client (rights/permissions)? → Marketing + legal.
- Logo/quote permissions per BR-8 / client agreements.

## Sources & traceability
ICP Report (audience), rootstrapedia case studies (content), Decisions 0007/0008, OQ-5.
