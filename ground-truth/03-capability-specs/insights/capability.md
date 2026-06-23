---
id: gt-03-capability-insights
title: "Capability: Insights / blog"
part: "03-capability-specs"
type: capability-spec
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources:
  - "gt-04-seo-and-llm-discovery (content is the LLM-discovery engine)"
  - "live: /blog; gt-01-goals-and-scope (discoverability goal)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-04-seo-and-llm-discovery", "gt-03-index"]
tags: ["insights", "blog", "seo", "llm-discovery"]
tier: "C2"
---

# Capability: Insights / blog

> Human-facing unit of value. Executable detail in the user stories below.

## Purpose
Publish thought leadership that earns organic search **and** LLM discovery — the primary engine for
being found and cited by AI assistants — reinforcing the AI-native positioning.

## Actors
Visitor / researcher (and AI crawlers) · Marketing editor / author.

## Outcomes / success
- Rootstrap is found and accurately cited for AI-delivery topics; insights pull ICP visitors in.

## Scope
**In:** insights index (browse/filter) + article pages. **Out:** gated content, the CRM.

## Capability-level acceptance
- [ ] Index is filterable by topic; articles carry author + date (E-E-A-T) and `Article` structured data.
- [ ] Content is server-rendered and **extractable** (clean headings, definitions, Q&A) for GEO (`04/seo-and-llm-discovery`).
- [ ] Accurate claims (BR-7/12); no internal data (BR-8); WCAG AA; no placeholder.

## User stories (agent-facing)
- [ ] [INSIGHT-1 · Insights index & filter](us-1-insights-index.md)
- [ ] [INSIGHT-2 · Article page (SEO + LLM discovery)](us-2-insights-article.md)
- [ ] [INSIGHT-3 · Migrate the Webflow blog](us-3-migrate-webflow-blog.md)

## Evals
`EV-SEO-REGRESSION`, `EV-GEO`, `EV-A11Y`, `EV-DATA`, `EV-INTERNAL-LEAK`, `EV-NO-PLACEHOLDER`.

## Open questions / human gates
- Editorial calendar → Marketing. (The **entire** Webflow blog migrates — US-3 — not a subset.)

## Sources & traceability
seo-and-llm-discovery; goals-and-scope; live /blog.
