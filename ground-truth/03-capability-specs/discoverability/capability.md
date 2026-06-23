---
id: gt-03-capability-discoverability
title: "Capability: Discoverability (SEO + LLM/GEO)"
part: "03-capability-specs"
type: capability-spec
owner: "Head of Marketing (suggested) + Platform Architect"
status: draft
confidence: medium
sources:
  - "gt-04-seo-and-llm-discovery (strategy)"
  - "gt-04-stack-and-architecture (Astro, server-rendered; Decision 0006)"
  - "gt-01-goals-and-scope (discoverability goal)"
  - "gt-02-business-rules (BR-7, BR-8, BR-11, BR-12)"
  - "live: rs-site/apps/marketing/public/llms.txt + robots.txt + astro.config.mjs (sitemap) (2026-06-22)"
  - "Decisions 0006 (exit Webflow → Astro/Vercel), 0012 (capability vs content)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-04-seo-and-llm-discovery", "gt-04-stack-and-architecture", "gt-03-capability-content-publishing", "gt-03-capability-insights", "gt-03-index"]
tags: ["seo", "geo", "llm", "discoverability"]
tier: "C3"
---

# Capability: Discoverability (SEO + LLM/GEO)

> A cross-cutting **function**: the site is found and **accurately cited** by search engines **and**
> AI assistants. Human-facing unit of value; the executable detail lives in the user stories linked
> below. Strategy detail lives in `04/seo-and-llm-discovery`.

## Purpose
Earn organic search and LLM/generative-engine visibility — and ensure both search engines and AI
assistants describe and cite Rootstrap **accurately**. Two audiences now mediate B2B research
(classic search and AI assistants) and both reward the same thing: fast, server-rendered,
well-structured, factual, citable content. Discoverability is the function that makes the marketing
site (`01/goals-and-scope`) reach its audience in the first place, and protects rankings/links
through the Webflow → Astro migration (Decision 0006).

## Actors
Search-engine crawlers (Googlebot, Bingbot) · AI assistant crawlers (GPTBot, ClaudeBot,
PerplexityBot, Google-Extended) · Visitor arriving from search or an AI answer · Marketing editor
(keeps facts/llms.txt accurate) · Build/CI agent (emits sitemap, structured data, redirects) ·
the system.

## Outcomes / success
- Critical content is in the server-rendered HTML — readable with no JavaScript (the single biggest win).
- Search engines index the site cleanly: valid metadata, canonicals, structured data, `sitemap.xml`.
- AI assistants answer "what does Rootstrap do / how do they work" accurately, currently, and **cite our pages**.
- The migration off Webflow loses **no rankings or inbound links** — every changed URL is 301-mapped.
- Wrong facts never get amplified: published claims are verified (BR-7), carry no internal data (BR-8), and follow BR-12.

## Scope
**In:** server-rendered semantic HTML + per-page metadata + schema.org structured data;
machine-discovery surfaces (`sitemap.xml`, `robots.txt`, `llms.txt`); 301 redirects from old
rootstrap.com URLs; the discoverability evals.
**Out:** authoring the page content itself (→ Content Publishing, Insights, Case-study showcase);
analytics/attribution measurement (→ Analytics & Measurement); the internal Explorer's crawl policy
(internal-only, OQ-2).

## Capability-level acceptance
Satisfied by the sum of the user stories below.
- [ ] Critical content is server-rendered; pages carry one `h1`, semantic structure, and per-page title/description/canonical.
- [ ] Valid schema.org JSON-LD: `Organization` site-wide, plus per-type (`Article` for insights, etc.).
- [ ] `sitemap.xml`, `robots.txt` (allowing reputable AI crawlers), and an accurate, in-sync `llms.txt` are served at the root.
- [ ] Every changed URL from old rootstrap.com 301-redirects to its new route — no ranking/link regression on migration.
- [ ] AI assistants answer "what does Rootstrap do / how do they work" accurately and cite our pages (GEO).
- [ ] No published stat is unverified (BR-7); no internal data leaks (BR-8); no "Anthropic partner" claim (BR-12); no placeholder (BR-11).

## User stories (agent-facing)
- [ ] [SEO-1 · Server-rendered semantic HTML + metadata + structured data](us-1-server-rendered-semantic-html.md)
- [ ] [SEO-2 · Machine-discovery surfaces (sitemap, robots, llms.txt)](us-2-machine-discovery-surfaces.md)
- [ ] [SEO-3 · 301 redirects from old rootstrap.com URLs](us-3-redirects-from-old-urls.md)

## Evals
`EV-SEO-REGRESSION` (server-rendered content + valid metadata/canonicals/structured-data + redirects),
`EV-GEO` (assistants answer accurately & cite us), plus shared `EV-A11Y`, `EV-DATA`,
`EV-INTERNAL-LEAK`, `EV-NO-PLACEHOLDER` (see `06-eval-suite`).

## Open questions / human gates
- Crawl policy for AI bots: confirm the allow-list (GPTBot/ClaudeBot/PerplexityBot/Google-Extended) and any future additions → Marketing (never expose BR-8 data).
- The authoritative old → new URL redirect map (which legacy URLs carry equity worth preserving) → Marketing + SEO, from analytics/Search Console.
- Whether to add an XML news/insights sitemap as the blog grows → Platform Architect.

## Sources & traceability
`04/seo-and-llm-discovery` (strategy), `04/stack-and-architecture` (Astro server-rendered, Decision
0006), live `llms.txt`/`robots.txt`/`astro.config.mjs` sitemap integration, business rules
BR-7/BR-8/BR-11/BR-12, Decision 0012 (capability vs content).
