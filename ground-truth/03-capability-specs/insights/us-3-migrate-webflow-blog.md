---
id: gt-03-us-insights-migrate-webflow
title: "INSIGHT-3 · Migrate the Webflow blog"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested) + Platform Architect"
status: approved
delivery_status: done
confidence: high
sources: ["Capability gt-03-capability-insights", "live: rootstrap.com/blog (Webflow CMS)", "gt-02-content-types (Insight/Post)", "Decision 0006 (exit Webflow)", "Decision 0013 (Sanity)"]
updated: 2026-06-24
last_validated: "2026-06-24"
validated_by: "Migration run — 375/375 posts → Sanity (count reconciled)"
applies_to: ["marketing-site"]
capability: gt-03-capability-insights
related: ["gt-03-capability-insights", "gt-02-content-types", "gt-04-seo-and-llm-discovery"]
tags: ["migration", "webflow", "blog", "seo"]
---

# User story: Migrate the Webflow blog

> Important: the **entire existing Webflow blog must be imported/migrated** into the new
> stack as `Insight/Post` content (`02/content-types`), with SEO preserved.

**As a** marketing editor **I want** the existing Webflow blog migrated into the Ground Truth / CMS
**so that** all posts move to the new site without losing content or rankings.

## Acceptance criteria — scenarios
**Scenario (US-insights-migrate-AC1): Import every post**
- **Given** the Webflow blog (CMS export / API)
- **When** migration runs
- **Then** every post imports as an `Insight/Post` (title, author, date, body, tags, media) — **none dropped**; a count reconciles source vs. imported.

**Scenario (US-insights-migrate-AC2): SEO preserved**
- **Then** post URLs are **preserved at `/blog/<slug>`** (decided Jun 2026 — no redirects needed) and `Article` structured data is intact — no ranking regression (the `EV-SEO-REGRESSION` gate).

**Scenario (US-insights-migrate-AC3): Media resolved**
- **Then** every post's images resolve and render. **Phase 1** keeps the Webflow CDN URLs (fast, lossless); **Phase 2** optionally rehosts assets to object storage. None missing.

## Definition of done
- [x] All scenarios pass · source↔imported count reconciles (375 = 375) · URLs preserved at `/blog/<slug>` · no placeholder.

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | migration-completeness check | imported count == source count |
| AC2 | `EV-SEO-REGRESSION` | URLs/redirects + structured data preserved |
| AC3 | `EV-NO-PLACEHOLDER` | every image resolves (Webflow CDN in phase 1), none missing |

## Migration procedure (decided Jun 2026)
- **Source:** Webflow Data API v2, `Blog Posts` collection (`646667178da40fc64fe11dd6`) — **375 posts**. Fields: `name` (title), `slug`, `post-body` (HTML), `data-created`, `post-summary`, `main-image`, `featured`, `author`→Authors, `tags`/`main-tag`→Tags, `topic`→Topics.
- **Target (updated — Decision 0013):** **Sanity** `post` documents — migrate Webflow → Sanity (not Git markdown). Astro reads posts from Sanity at build; the migration script becomes Webflow → Sanity (write token). The local markdown samples remain only as a seed/fallback.
- **URLs:** kept at **`/blog/<slug>`** (no redirects) to preserve SEO/backlinks.
- **References:** the script builds id→name maps for Authors and Tags.
- **Script:** `rs-site/scripts/migrate-blog.mjs` — run `WEBFLOW_TOKEN=… node scripts/migrate-blog.mjs` (CI or local). Claude never holds the token.
- **Status:** **DONE (Jun 2026).** Full run complete via `rs-site/scripts/migrate-blog.mjs`: **375/375 posts**, 105 authors, 621 categories; all images (371 hero + inline across 273 posts) uploaded to Sanity assets; `post-body` HTML → Portable Text; author/category refs resolve. URLs preserved at `/blog/<slug>`.

## Notes / human gates
- Source = Webflow Data API; confirm token access. One-time bulk migration + ongoing publishing thereafter.
