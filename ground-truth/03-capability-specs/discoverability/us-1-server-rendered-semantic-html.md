---
id: gt-03-us-ssr-semantic
title: "US-1 — Server-rendered semantic HTML + metadata + structured data"
part: "03-capability-specs"
type: user-story
owner: "Platform Architect (suggested)"
status: draft
confidence: medium
sources:
  - "Capability gt-03-capability-discoverability"
  - "gt-04-seo-and-llm-discovery (foundational rule: critical content in server-rendered HTML)"
  - "gt-04-stack-and-architecture (Astro + React islands; ship ~no JS)"
  - "gt-02-business-rules (BR-7, BR-8, BR-12)"
  - "live: rs-site/apps/marketing/public/llms.txt (Organization facts) (2026-06-22)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-discoverability
related: ["gt-03-capability-discoverability", "gt-04-seo-and-llm-discovery", "gt-03-capability-content-publishing"]
tags: ["seo", "geo", "ssr", "structured-data", "schema-org"]
---

# User story: Server-rendered semantic HTML + metadata + structured data

> Agent-facing. Implement against these scenarios; an independent eval verifies them.

**As a** search engine or AI assistant (and the visitors they send) **I want** every page delivered as
server-rendered, semantic HTML with accurate metadata and structured data **so that** the site is
indexed, understood, and **accurately cited** — even without running JavaScript.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Crawler (Googlebot / GPTBot / ClaudeBot, no-JS fetch) | Read full page content + metadata + JSON-LD from initial HTML | Require client-side JS to read primary content |
| Visitor (anon) | Land on a fast, semantic, accessible page | See unpublished/internal data |
| Build/CI agent | Emit per-page metadata + schema.org JSON-LD from Ground Truth | Publish unverified (BR-7) or internal (BR-8) facts; invent claims |

## Preconditions
- The marketing site is built on Astro (server-rendered / static; React islands only where interactive — `04/stack-and-architecture`, Decision 0006).
- Page content and facts come from the Ground Truth; the Organization facts mirror `llms.txt` (name, description, proof points, contact, sameAs links).

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-ssr-semantic-AC1): Critical content in server-rendered HTML**
- **Given** any indexable marketing page (Home, How-we-work, AI, Work, About, Insights)
- **When** the page is fetched with JavaScript disabled (as an LLM crawler would)
- **Then** the primary content — headings, copy, links, proof — is present in the initial HTML, not injected by JS (the foundational rule in `04/seo-and-llm-discovery`).

**Scenario (gt-03-us-ssr-semantic-AC2): Semantic structure**
- **Given** a rendered page
- **When** its DOM is inspected
- **Then** it has exactly **one** `h1`, a sensible heading hierarchy (no skipped levels), landmark elements (`header`/`nav`/`main`/`footer`), and descriptive `alt` text on meaningful images.

**Scenario (gt-03-us-ssr-semantic-AC3): Per-page metadata**
- **Given** any page
- **Then** it has a unique, descriptive `<title>` and `meta description`, a self-referential `<link rel="canonical">`, and Open Graph / Twitter card tags — no duplicated or empty titles/descriptions across pages.

**Scenario (gt-03-us-ssr-semantic-AC4): Organization structured data site-wide**
- **Given** any page
- **Then** valid `Organization` schema.org JSON-LD is present (name, url, logo, `sameAs` for LinkedIn, description) and its facts match the Ground Truth / `llms.txt` (no contradiction).

**Scenario (gt-03-us-ssr-semantic-AC5): Per-type structured data**
- **Given** a typed page (e.g. an insights article)
- **Then** the matching schema.org type is emitted — `Article` for insights (with author + date for E-E-A-T), and `BreadcrumbList` / `Service` / `FAQPage` where the template warrants — and it validates against schema.org.

**Scenario (gt-03-us-ssr-semantic-AC6): Accurate, safe claims**
- **Given** facts and stats rendered or embedded in JSON-LD
- **Then** every stat is verified (BR-7) and uses the approved public figures (750+ products · 180+ team · 14 yrs · 5 startups to $1B+); no internal data (BR-8); no "Anthropic partner" claim (BR-12) — "Anthropic-certified teams" and "SOC 2 certified" are allowed.

## Definition of done
- [ ] All scenarios pass their evals · accessible (WCAG AA) · content server-rendered (readable with JS off) · structured data validates · no placeholder content (BR-11).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| gt-03-us-ssr-semantic-AC1 | `EV-SEO-REGRESSION` | primary content present in initial HTML on a no-JS fetch |
| gt-03-us-ssr-semantic-AC2 | `EV-A11Y` | one `h1`, valid heading order, landmarks, alt text; 0 blocking violations |
| gt-03-us-ssr-semantic-AC3 | `EV-SEO-REGRESSION` | unique title/description + self-canonical + OG/Twitter tags on every page |
| gt-03-us-ssr-semantic-AC4 | `EV-SEO-REGRESSION` | valid `Organization` JSON-LD present site-wide |
| gt-03-us-ssr-semantic-AC5 | `EV-SEO-REGRESSION` | correct per-type schema.org emitted and validates |
| gt-03-us-ssr-semantic-AC6 | `EV-DATA`, `EV-INTERNAL-LEAK` | verified public stats; no internal data; no BR-12 violation |

## Notes / human gates
- The canonical schema.org type per template (e.g. `Service` vs `ProfessionalService`; whether case studies use `Review`/`CreativeWork`) → Platform Architect + Marketing.
- Any new public proof point or claim before it ships → Marketing (BR-7 verification + BR-12 wording).
