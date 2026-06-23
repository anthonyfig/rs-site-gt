---
id: gt-03-us-redirects
title: "US-3 — 301 redirects from old rootstrap.com URLs"
part: "03-capability-specs"
type: user-story
owner: "Platform Architect (suggested) + Head of Marketing"
status: draft
confidence: medium
sources:
  - "Capability gt-03-capability-discoverability"
  - "gt-04-seo-and-llm-discovery (migration safety: 301-map every changed URL)"
  - "gt-04-stack-and-architecture (301-map any changed URLs; Vercel host)"
  - "Decision 0006 (exit Webflow → Astro/Vercel)"
  - "gt-03-us-insights-migrate-webflow (blog migration preserves URLs/301s)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-discoverability
related: ["gt-03-capability-discoverability", "gt-04-seo-and-llm-discovery", "gt-07-0006-exit-webflow-astro-vercel"]
tags: ["seo", "migration", "redirects", "webflow"]
---

# User story: 301 redirects from old rootstrap.com URLs

> Agent-facing. Implement against these scenarios; an independent eval verifies them.

**As** the business **I want** every old rootstrap.com URL 301-redirected to its new route **so that**
search rankings, inbound links, and bookmarks survive the Webflow → Astro migration (Decision 0006)
with no traffic or equity lost.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor / inbound link | Hit an old URL and land on the right new page | Reach a 404 or a redirect chain/loop on a known old URL |
| Search crawler | Follow a single 301 and transfer ranking to the new URL | Discover broken or soft-404 legacy URLs |
| Build/CI agent | Apply the redirect map at the edge (Vercel) and verify it | Use 302/temporary redirects for permanent moves; drop a mapped URL silently |
| Marketing + SEO | Own the authoritative old → new map (which URLs carry equity) | — |

## Preconditions
- The old → new URL redirect map exists (sourced from analytics / Search Console / the old sitemap — see `02/...` old-site IA inventory) and is reviewed by Marketing + SEO.
- The new Astro site is deployed on Vercel, where redirects are configured (host-level, not framework — `04/stack-and-architecture`).

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-redirects-AC1): Every changed URL 301-redirects**
- **Given** an old rootstrap.com URL whose path changed in the new site
- **When** a visitor or crawler requests it
- **Then** the server responds with a **301 (permanent)** redirect to the correct new URL — not a 302, not a 404, not the generic homepage (unless the homepage is the genuine mapping).

**Scenario (gt-03-us-redirects-AC2): Single hop, no chains or loops**
- **Given** the redirect map
- **When** any mapped URL is followed
- **Then** it resolves to a final 200-OK page in **one** redirect — no chains (301 → 301 → …) and no loops.

**Scenario (gt-03-us-redirects-AC3): High-equity pages preserved**
- **Given** the set of high-traffic / high-link-equity legacy pages (incl. migrated blog posts — see `us-3-migrate-webflow-blog`)
- **Then** each has an explicit, verified redirect (or a preserved canonical URL), so no ranking regression occurs (the `EV-SEO-REGRESSION` launch gate).

**Scenario (gt-03-us-redirects-AC4): Unchanged URLs still resolve**
- **Given** an old URL whose path is unchanged in the new site
- **Then** it returns 200 directly (no needless redirect), and its canonical points to itself.

**Scenario (gt-03-us-redirects-AC5): Coverage reconciles against the old sitemap**
- **Given** the inventory of old URLs (old sitemap + Search Console)
- **When** coverage is checked
- **Then** every old URL is accounted for — mapped to a 301 or confirmed unchanged — with **no orphan** old URL returning 404.

## Definition of done
- [ ] All scenarios pass their evals · old→new map reconciles against the old sitemap · all 301s resolve in one hop · launch gate `EV-SEO-REGRESSION` green · no placeholder (BR-11).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| gt-03-us-redirects-AC1 | `EV-SEO-REGRESSION` | each changed old URL returns 301 → correct new URL |
| gt-03-us-redirects-AC2 | `EV-SEO-REGRESSION` | one hop to a 200; no chains or loops |
| gt-03-us-redirects-AC3 | `EV-SEO-REGRESSION` | high-equity pages redirected/preserved; rankings parity-or-better |
| gt-03-us-redirects-AC4 | `EV-SEO-REGRESSION` | unchanged URLs return 200 with self-canonical (no needless redirect) |
| gt-03-us-redirects-AC5 | `EV-SEO-REGRESSION` | every old-sitemap URL accounted for; 0 orphan 404s |

## Notes / human gates
- The authoritative old → new redirect map — which legacy URLs are worth preserving and where each maps — → Marketing + SEO (from analytics / Search Console). An agent must not invent mappings.
- Edge-redirect mechanism (Vercel config vs. middleware) and any wildcard/path-pattern rules → Platform Architect.
