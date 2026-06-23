---
id: gt-05-sanity
title: "Sanity (content CMS)"
part: "05-integration-contracts"
type: integration-contract
owner: "Platform Architect (suggested)"
status: draft
confidence: high
sources:
  - "Decision 0013 (marketing content in Sanity)"
  - "Sanity content API / GROQ / image CDN; @sanity/astro"
updated: 2026-06-23
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-07-0013-marketing-content-in-sanity", "gt-03-capability-content-publishing", "gt-03-capability-case-study-showcase", "gt-03-capability-insights"]
tags: ["sanity", "cms", "content"]
---

# Sanity (content CMS)

> The source of truth for **marketing content** — case studies, blog/insights, and editable page copy.
> Marketing authors in **Sanity Studio**; Astro reads at build (Decision 0013). The GT *model* stays in Git.

## Purpose
A no-code editor for marketing; structured content for Astro via API.

## Shape
- **Project:** `projectId` + `dataset` (e.g. `production`). Studio deployed for the team.
- **Schemas:** `caseStudy` (client, logo, cover, industry, summary, services[], tech[], outcomes[], body, order) ·
  `post` (title, slug, date, summary, image, author→`author`, tags[]→`category`, body) · `author` · `category` ·
  (optional) `capability`.
- **Read path:** Astro fetches via GROQ (`@sanity/client` / `@sanity/astro`) at build; images via the Sanity image CDN (`@sanity/image-url`).
- **Publish → deploy:** a Sanity **webhook** calls a Vercel **Deploy Hook**, so publishing rebuilds the site.

## Auth / secrets
- A **read token** (or public dataset) for build-time reads; a **write token** only for the one-time migration.
  Server/CI-side only — never in client code (BR-8).

## Failure handling
- A failed fetch fails the build, not the live site (last successful deploy stays up). Drafts excluded from production reads.

## Open questions
- Dataset/preview strategy; editor roles; the Webflow→Sanity field mapping (see INSIGHT-3 + the migration script).
