---
id: gt-03-capability-discoverability
title: "Capability: Discoverability (SEO + LLM/GEO)"
part: "03-capability-specs"
type: capability-spec
owner: "Head of Marketing (suggested) + Platform Architect"
status: draft
confidence: medium
sources: ["Decision 0012", "gt-04-seo-and-llm-discovery", "gt-01-goals-and-scope (discoverability goal)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-04-seo-and-llm-discovery", "gt-03-capability-content-publishing", "gt-03-index"]
tags: ["seo", "geo", "discoverability"]
tier: "C2"
---

# Capability: Discoverability (SEO + LLM/GEO)

> A cross-cutting **function**: the site is found and accurately cited by search engines **and** AI
> assistants. Strategy detail lives in `04/seo-and-llm-discovery`.

## Purpose
Earn organic search and LLM/generative-engine visibility — and ensure assistants describe and cite
Rootstrap accurately.

## Capability-level acceptance
- [ ] Critical content server-rendered; valid schema.org; `sitemap.xml`; `llms.txt`.
- [ ] No SEO regressions on migration (301-map changed URLs).
- [ ] AI assistants answer "what does Rootstrap do / how do they work / pricing" accurately and cite our pages.

## User stories
Just-in-time (e.g., "structured data per template", "llms.txt", "GEO citation eval").

## Evals
`EV-SEO-REGRESSION`, `EV-GEO`.

## Open questions / human gates
- Crawl policy for AI bots (allow GPTBot/ClaudeBot/Google-Extended) → Marketing (never expose BR-8 data).
