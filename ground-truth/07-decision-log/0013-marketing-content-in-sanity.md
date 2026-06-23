---
id: gt-07-0013-marketing-content-in-sanity
title: "0013 — Marketing content in Sanity (headless CMS)"
part: "07-decision-log"
type: decision
owner: "Anthony + Platform Architect (suggested)"
status: approved
confidence: high
sources:
  - "User decision (Jun 2026): 'Webflow has to die — go with Sanity.' Marketing needs no-code editing."
  - "Refines Decision 0010 (Git = system of record); confirms 0006 (exit Webflow); relates to content-types + Content Publishing"
updated: 2026-06-23
last_validated: "2026-06-23"
validated_by: "Anthony"
applies_to: ["marketing-site"]
related: ["gt-07-0010-git-system-of-record-db-engine", "gt-07-0006-exit-webflow-astro-vercel", "gt-02-content-types", "gt-05-index", "gt-03-us-insights-migrate-webflow"]
tags: ["adr", "cms", "sanity", "content"]
---

# 0013 — Marketing content in Sanity (headless CMS)

**Status:** Approved — Anthony · **Date:** 2026-06-23

## Context
Astro is a static site generator, not a CMS — no admin. Marketing must add/edit case studies and blog
posts without touching code or Git. Content currently lived as markdown in the repo (Decision 0010),
which is engineer-friendly but not marketing-friendly.

## Decision
- **Marketing content** (case studies, blog/insights, and editable page copy) lives in **Sanity** — a
  headless CMS. Marketing edits in **Sanity Studio** (the admin).
- **Astro builds from Sanity** at build time (GROQ over the Sanity content API); a Sanity **webhook
  triggers a Vercel rebuild** on publish. Images use Sanity's asset/CDN pipeline.
- **Webflow is fully retired** (confirms Decision 0006). The 375 posts + case studies **migrate
  Webflow → Sanity** — this supersedes INSIGHT-3's earlier Webflow→Git-markdown plan.

## How this refines Decision 0010
- The **Ground Truth model** (capabilities, decisions, domain — this repo) **stays in Git** (0010 holds).
- **Published marketing content** (case-study & post *instances*) now has its **source of truth in
  Sanity**, not Git — consistent with Decision 0012 (content ≠ the capability model).
- The local markdown content collections become a **seed/fallback**; once Sanity is live, Astro reads from Sanity.

## Consequences / tradeoffs
- Marketing gets a real no-code editor with roles, drafts, and preview; structured content + a clean API.
- Adds a Sanity project (generous free tier; paid as it scales) and a build-on-publish webhook.
- One-time Webflow→Sanity migration; Astro's content layer rewires from local markdown to Sanity.
- **Needs from the team:** a Sanity **projectId + dataset + read token** (plus a write token for migration).

## Open questions / human gates
- Sanity project + dataset names; who administers; the draft/preview workflow.
- Whether `capabilities` content also moves to Sanity (recommend: content in Sanity; the capability *model* stays in the GT).
