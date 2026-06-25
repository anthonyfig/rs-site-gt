---
id: gt-04-deployment-and-build
title: "Deployment & build-time contract"
part: "04-engineering-context"
type: engineering-context
owner: "Platform Architect (suggested) + Anthony"
status: approved
confidence: high
sources:
  - "Live deploy debugging (Jun 2026): blank /blog + /work on Vercel traced to missing PUBLIC_ env vars; `sanity deploy` needed sanity.cli.ts; contact form needed the portal tracking script."
  - "Decision 0013 (Sanity), Decision 0018 (HubSpot collected forms)"
updated: 2026-06-24
last_validated: "2026-06-24"
validated_by: "Anthony"
applies_to: ["marketing-site"]
related: ["gt-04-stack-and-architecture", "gt-07-0013-marketing-content-in-sanity", "gt-07-0018-contact-form-hubspot-collected-forms"]
tags: ["engineering", "deployment", "vercel", "build", "env"]
---

# Deployment & build-time contract

The marketing site is a **static Astro build on Vercel**. Content is read from **Sanity at build time**
(GROQ over the public API) and baked into HTML — the live site changes only on a **rebuild**, not when
Sanity content changes. Plan deploys around that.

## Required env vars (Vercel — Production AND Preview)
`PUBLIC_`-prefixed vars are exposed to the Astro/Vite build; they are public identifiers, not secrets.
Local `.env` is gitignored and does **not** propagate to Vercel — set them in the Vercel project too.

| Var | Value | Without it |
|-----|-------|-----------|
| `PUBLIC_SANITY_PROJECT_ID` | `yhtotv15` | build **silently** returns empty → blog/case studies render nothing, no error |
| `PUBLIC_SANITY_DATASET` | `production` | wrong/empty dataset |
| `PUBLIC_HUBSPOT_PORTAL_ID` | `3965030` | tracking script absent → contact form doesn't capture |

**Failure mode learned the hard way:** a build missing `PUBLIC_SANITY_PROJECT_ID` ships an empty site with
**no build error** (the Sanity helper warns and returns `[]`). Recommendation (open): make the build **fail
loudly** when the id is unset, so misconfig is a red build, not a silently empty site.

## Publish -> rebuild
Editor publishes in Sanity Studio -> a **Sanity webhook hits a Vercel Deploy Hook** -> Vercel rebuilds and
the new content goes live. No rebuild = no change live.

## Sanity Studio deploy
`sanity deploy` reads project identifiers from **`apps/studio/sanity.cli.ts`** (`api.projectId`), NOT
`sanity.config.ts`. Keep `sanity.cli.ts` present and env-driven; the CLI loads `apps/studio/.env` in
production mode before reading the config.

## Verify after every deploy
- `/blog` and `/work` render real Sanity content (not empty).
- A test contact submission appears in HubSpot (portal `3965030`).
