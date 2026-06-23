---
id: gt-03-us-machine-surfaces
title: "SEO-2 · Machine-discovery surfaces (sitemap, robots, llms.txt)"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested) + Platform Architect"
status: draft
delivery_status: in-progress
confidence: medium
sources:
  - "Capability gt-03-capability-discoverability"
  - "gt-04-seo-and-llm-discovery (llms.txt + crawl policy for reputable AI bots)"
  - "live: rs-site/apps/marketing/public/llms.txt + robots.txt (2026-06-22)"
  - "live: rs-site/apps/marketing/astro.config.mjs (@astrojs/sitemap → sitemap-index.xml)"
  - "gt-02-business-rules (BR-7, BR-8, BR-12)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-discoverability
related: ["gt-03-capability-discoverability", "gt-04-seo-and-llm-discovery"]
tags: ["seo", "geo", "sitemap", "robots", "llms-txt"]
---

# User story: Machine-discovery surfaces (sitemap, robots, llms.txt)

> Agent-facing. Implement against these scenarios; an independent eval verifies them.

**As a** search-engine or AI crawler **I want** standard discovery files at the site root —
`sitemap.xml`, `robots.txt`, and `llms.txt` — that are valid, allow reputable AI bots, and stay in
sync with the live content **so that** the whole site is found and its facts are read accurately.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Search crawler (Googlebot/Bingbot) | Fetch `robots.txt` + `sitemap.xml`; crawl allowed paths | Be blocked from primary marketing content |
| AI crawler (GPTBot/ClaudeBot/PerplexityBot/Google-Extended) | Fetch `robots.txt` + `llms.txt`; read public pages | Access internal/Explorer-only data (BR-8) |
| Build/CI agent | Generate `sitemap.xml` from routes at build; keep `llms.txt` synced | Ship a sitemap with stale/404 or non-canonical URLs |
| Marketing editor | Keep `llms.txt` facts accurate | Add unverified (BR-7) or internal (BR-8) facts |

## Preconditions
- The marketing site is built on Astro with `@astrojs/sitemap` and `site: https://www.rootstrap.com` configured (`astro.config.mjs`) — it emits `sitemap-index.xml` + `sitemap-0.xml`.
- `robots.txt` and `llms.txt` are served from the site root (`apps/marketing/public/`).

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-machine-surfaces-AC1): Valid sitemap of canonical URLs**
- **Given** the built site
- **When** a crawler fetches `/sitemap-index.xml`
- **Then** it returns valid XML referencing per-URL sitemaps; every listed URL is a canonical, indexable, 200-OK page (no 404s, no redirected or non-canonical URLs, no internal/Explorer paths).

**Scenario (gt-03-us-machine-surfaces-AC2): robots.txt allows search + reputable AI crawlers**
- **Given** the site root
- **When** a crawler fetches `/robots.txt`
- **Then** it allows general crawling (`User-agent: *` → `Allow: /`), explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, and Google-Extended, and points to the sitemap (`Sitemap: https://www.rootstrap.com/sitemap-index.xml`).

**Scenario (gt-03-us-machine-surfaces-AC3): llms.txt present and parseable**
- **Given** the site root
- **When** an AI assistant fetches `/llms.txt`
- **Then** it returns a concise, link-rich Markdown map (what Rootstrap does, how we work, core services, selected case studies, pages, contact) with absolute `https://www.rootstrap.com/...` links.

**Scenario (gt-03-us-machine-surfaces-AC4): llms.txt stays in sync with content**
- **Given** `llms.txt` and the live pages/Ground Truth
- **When** content or proof points change
- **Then** `llms.txt` is updated to match — its facts, stats, page list, and case studies do not contradict the live site (sync is part of the publish/eval loop, not a one-off).

**Scenario (gt-03-us-machine-surfaces-AC5): No unverified, internal, or false claims in llms.txt**
- **Given** `llms.txt`
- **Then** stats use the approved public figures (750+ products · 180+ team · 14 yrs · 5 startups to $1B+), no internal data appears (BR-8), and it states "Anthropic-certified teams" / "SOC 2 certified" but never "Anthropic partner" (BR-12).

## Definition of done
- [ ] All scenarios pass their evals · sitemap/robots/llms.txt served at root and valid · llms.txt synced with content · no internal data (BR-8) · no placeholder (BR-11).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| gt-03-us-machine-surfaces-AC1 | `EV-SEO-REGRESSION` | sitemap is valid XML; every URL is canonical + 200 + indexable; no internal paths |
| gt-03-us-machine-surfaces-AC2 | `EV-SEO-REGRESSION` | robots.txt allows `*` + named AI bots and references the sitemap |
| gt-03-us-machine-surfaces-AC3 | `EV-GEO` | llms.txt fetchable + parseable; assistants can use it to answer accurately |
| gt-03-us-machine-surfaces-AC4 | `EV-DATA`, `EV-GEO` | llms.txt facts match the live site; no contradictions |
| gt-03-us-machine-surfaces-AC5 | `EV-INTERNAL-LEAK`, `EV-DATA` | approved public stats only; no internal data; no BR-12 violation |

## Notes / human gates
- The AI-crawler allow-list (adding/removing bots; any future disallow) → Marketing — never expose BR-8 data to any crawler.
- Whether to split out a dedicated insights/news sitemap as the blog grows → Platform Architect.
