---
id: gt-04-seo-and-llm-discovery
title: "SEO & LLM Discovery"
part: "04-engineering-context"
type: engineering-context
owner: "Head of Marketing + Platform Architect"
status: draft
confidence: medium
sources:
  - "User instruction (Jun 2026): optimize stack for SEO and LLM discovery"
  - "Observed failure mode: current Webflow homepage renders content client-side (empty to non-JS fetch)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-04-stack-and-architecture", "gt-06-index"]
tags: ["seo", "geo", "llm", "discovery"]
---

# SEO & LLM Discovery

Two audiences now find Rootstrap: **search engines** and **AI assistants** (which increasingly
mediate B2B research). Both reward the same things — fast, server-rendered, well-structured,
factual, citable content — which is also exactly what the Astro choice (Part 04 stack) enables.

## Foundational rule
**Critical content must be in the server-rendered HTML, not injected by JavaScript.** The current
site's homepage fails this (its case-study carousel was empty/placeholder to a non-JS fetch); most
LLM crawlers behave like that fetch. This rule alone is the biggest single win.

## Classic SEO
- Static/SSR pages, excellent Core Web Vitals, mobile-first.
- Clean, stable URL taxonomy; `sitemap.xml`; correct canonicals.
- **Schema.org structured data**: `Organization`, `Service`/`ProfessionalService`, `Article`
  (insights), `BreadcrumbList`, `FAQPage`, `CaseStudy`-style `Review`/`CreativeWork`.
- Semantic HTML, one `h1`, descriptive headings, alt text, internal linking.
- **Migration safety:** 301-map every changed URL; preserve high-equity pages; verify no ranking
  regressions (a launch gate — Part 06).

## LLM / Generative-Engine discovery (GEO)
- **`llms.txt`** at the root: a concise, link-rich map of the site + canonical fact pages, written
  for models. (Emerging convention; cheap to add, easy to maintain from Ground Truth.)
- **Write extractable, declarative content**: definitions, short Q&A, named entities, clear
  claims with numbers. LLMs quote well-structured, self-contained statements. The Ground Truth
  vocabulary, business rules, and the Explorer's Q&A are *natively* this shape.
- **Stable, citable fact pages** with author + date (E-E-A-T): the Explorer's traceable,
  sourced, dated artifacts are ideal citation targets.
- **Crawl policy:** allow reputable AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
  by default; expose `robots.txt` accordingly. *Guardrail:* never expose **BR-8** internal data;
  a public Explorer (OQ-2) must serve only public artifacts.
- **Freshness:** keep `updated`/`last_validated` visible; models and search both favor current pages.

## Measurement (ties to Part 06)
- Track AI-referral traffic (where attributable) and classic organic rankings.
- **GEO eval:** periodically prompt major assistants ("What does Rootstrap do? How do they price AI
  work?") and check the answer is accurate, current, and cites our pages — a regression eval, not a
  one-off. Inaccurate AI answers are treated as content bugs.

## Don'ts
- Don't gate primary marketing content behind JS or auth.
- Don't publish unverified stats (BR-7) or internal figures (BR-8) — wrong facts get amplified by LLMs.
