---
id: gt-07-0006-exit-webflow-astro-vercel
title: "0006 — Exit Webflow; rebuild marketing site (target Astro on Vercel)"
part: "07-decision-log"
type: decision
owner: "Platform Architect (suggested) + Anthony"
status: approved
confidence: high
sources: ["User decision (Jun 2026): leave Webflow; framework confirmed = Astro on Vercel"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["marketing-site"]
related: ["gt-07-0002-stack", "gt-04-stack-and-architecture", "gt-04-seo-and-llm-discovery"]
tags: ["adr", "hosting", "migration"]
---

# 0006 — Exit Webflow; rebuild the marketing site

**Status:** Accepted — **framework confirmed: Astro on Vercel** · **Date:** 2026-06-22 · (Supersedes the "keep Webflow" option in OQ-3)

## Decision
**Leave Webflow** ("RS2.0 - MASTER") and rebuild the marketing site in-house on **Astro, deployed
on Vercel** (confirmed by sponsor, Jun 2026). The Explorer stays React 19 + Vite + Supabase + the
Claude API (Decision 0005).

## Clarification (the question behind the question)
"Astro vs. Vercel" was not a choice — **Astro is the framework; Vercel is the host;** you build
with Astro and deploy it *on* Vercel. Alternatives weighed: **Next.js** (one framework for both
surfaces, heavier JS on content pages) and a **plain React SPA** (client-rendered → weak SEO/LLM).
**Astro** chosen for content-first SEO + LLM discovery, with React/shadcn islands for interactivity.

## Why Astro (recommended)
Content-first; ships ~zero JS; content lives in **server-rendered HTML** (the exact thing the
current site fails — and what SEO **and** LLM crawlers need); MD/MDX content collections map
cleanly to Ground-Truth-derived content; React/shadcn **islands** where interactivity is needed.

## Consequences
- Migration plan with **301 redirects** to preserve SEO equity (EV-SEO-REGRESSION gate).
- Confirm framework, then finalize Decision `0002` and stand up the monorepo.
