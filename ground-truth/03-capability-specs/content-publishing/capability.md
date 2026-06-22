---
id: gt-03-capability-content-publishing
title: "Capability: Content Management & Publishing"
part: "03-capability-specs"
type: capability-spec
owner: "Head of Marketing (suggested) + Platform Architect"
status: draft
confidence: medium
sources:
  - "Decision 0012 (capability vs content); gt-02-content-types"
  - "Part 01 positioning/audience; gt-02-entities (offering, proof); /ai-landing; June 2026 Overview"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-02-content-types", "gt-02-entities", "gt-01-goals-and-scope", "gt-03-capability-lead-capture", "gt-04-seo-and-llm-discovery"]
tags: ["content", "publishing", "pages"]
tier: "C3"
---

# Capability: Content Management & Publishing

> Human-facing unit of value. The **function** that authors, structures, and presents the site's
> **content** (pages + collections) from the Ground Truth — so the marketing pages (Home, About,
> How-we-work, AI offering, Careers) and the Industries collection are *content instances*
> (`02/content-types`), not capabilities. Executable detail in the user stories below.

## Purpose
Present every page and collection correctly, on-brand, accessible, and discoverable — and let
editors maintain content without engineering. (One function serving many content items — Decision 0012.)

## Actors
Visitor (+ AI crawlers) · Marketing editor · Ingest agent · System.

## Outcomes / success
- Any page/collection renders correctly, server-side, on-brand, accessible, and discoverable.
- Editors add/update content (incl. uploads) through a human-gated flow — no code per page.

## Scope
**In:** page rendering; the marketing pages (as content); collection browse/filter/detail (Industries);
content ingest. **Out:** Case Studies (own capability), Insights/Blog (own capability), lead capture, the CRM.

## Capability-level acceptance
- [ ] Any page/collection is server-rendered with valid structured data; WCAG AA; no placeholder (BR-11).
- [ ] Published content is accurate (BR-7) and leaks no internal data (BR-8); claims follow BR-12.
- [ ] Collections are filterable; editors can ingest content behind a human gate.

## User stories (agent-facing)
- [ ] [US-1 — Render any page/collection (server-side, structured, accessible)](us-1-render-page.md)
- [ ] [US-2 — Present the marketing pages from content](us-2-marketing-pages.md)
- [ ] [US-3 — Collection browse / filter / detail](us-3-collection.md)
- [ ] [US-4 — Content ingest (upload → propose → human gate)](us-4-content-ingest.md)

## Evals
`EV-SEO-REGRESSION`, `EV-A11Y`, `EV-GEO`, `EV-DATA`, `EV-INTERNAL-LEAK`, `EV-NO-PLACEHOLDER`, `EV-INGEST-PLACEMENT`, `EV-HUMAN-GATE`.

## Open questions / human gates
- CMS approach: Astro content collections vs. a headless CMS feeding the build → Platform Architect (OQ-3 family).
- Which pages are launch-critical.

## Sources & traceability
Decision 0012; content-types; Part 01 positioning; entities; seo-and-llm-discovery.
