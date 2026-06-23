---
id: gt-03-capability-navigation-search
title: "Capability: Navigation & Search"
part: "03-capability-specs"
type: capability-spec
owner: "Product Architect (suggested) + Head of Marketing"
status: draft
confidence: medium
sources:
  - "Decision 0012 (a function reused across all content, not a content type)"
  - "live: rs-site/apps/marketing/src/layouts/Base.astro (nav, footer, skip-link — fetched 2026-06-22)"
  - "gt-02-content-types (Page, Collection: Industries · Case Studies · Insights)"
  - "gt-01-audience-and-icp (ICP personas A/B/C — wayfinding by role/industry)"
  - "KB navigation research (rs-ip docs)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-03-capability-content-publishing", "gt-03-capability-discoverability", "gt-02-content-types", "gt-01-audience-and-icp", "gt-03-index"]
tags: ["navigation", "search", "ia", "wayfinding", "a11y"]
tier: "C2"
---

# Capability: Navigation & Search

> Human-facing unit of value — a **function** reused across every page and collection (Decision 0012),
> **not** a content type. It helps a visitor move through the information architecture and find content,
> in plain language, on any device. The executable detail lives in the three user stories below.

## Purpose
Let any visitor orient, move through the site, and find the content they need — in plain,
non-technical language and on any device — so a skeptical product/eng leader (Persona A) or a
non-technical founder (Persona C) can reach proof, the method, or a conversation in a few clicks,
without dead ends or jargon. Navigation is the connective tissue that makes the content
(`02/content-types`) usable.

## Actors
Visitor (anonymous; ICP personas A/B/C) · Keyboard / screen-reader user · AI crawler (follows the
same server-rendered links) · Marketing editor (owns nav labels + IA taxonomy) · the system.

## Outcomes / success
- A visitor always knows **where they are** and **where they can go** — current section is indicated,
  and the "Start a Discovery Sprint" CTA is reachable from every page.
- Content across collections (Insights, Case Studies, Industries) is **findable** via clear,
  browsable indexes — no visitor hits a dead end looking for something that exists.
- The whole experience is **operable by keyboard and screen reader** (WCAG AA) and works on mobile.

## Scope
**In:** primary header navigation, footer navigation, the mobile menu, current-section indication,
browse/filter index entry points into collections, breadcrumbs/wayfinding, and the accessibility
substrate (skip-link, focus order, landmarks).
**Out:** the *rendering* of each page/collection and its filters (Content Management & Publishing);
SEO/structured-data and `llms.txt` (Discoverability); the case-study filter taxonomy itself
(Case-study showcase); lead capture and the CRM.

## Capability-level acceptance
- [ ] Navigation reflects the information architecture in **user language** (How we work · AI · Work ·
      About), not internal jargon; it is **server-rendered** (works with JS disabled and is crawlable).
- [ ] The current section is indicated, and the **"Start a Discovery Sprint" CTA** is reachable from
      every page (header on desktop, mobile menu on small screens).
- [ ] On small screens a **mobile menu** exposes the same destinations + CTA; it is keyboard-operable.
- [ ] Content across collections is **findable** via clear browse/filter indexes (Insights, Case
      Studies, Industries) — the chosen approach over an on-site search index (see US-2 rationale).
- [ ] Wayfinding (breadcrumbs on collection detail pages, a working skip-link, correct landmarks and
      focus order) meets **WCAG AA**.
- [ ] No placeholder/lorem nav labels or links (BR-11); no internal-only destinations exposed (BR-8).

## User stories (agent-facing)
- [ ] [NAV-1 · Primary navigation (header · footer · mobile menu · CTA)](us-1-primary-navigation.md)
- [ ] [NAV-2 · Find content across collections](us-2-find-content.md)
- [ ] [NAV-3 · Wayfinding & accessibility (breadcrumbs · skip-link · landmarks)](us-3-wayfinding-a11y.md)

## Evals
`EV-A11Y`, `EV-SEO-REGRESSION` (links present and crawlable in initial HTML), plus a functional
navigation/findability eval `EV-NAV` to register (covers current-section indication, mobile-menu
parity, and index reachability). See `06-eval-suite`.

## Open questions / human gates
- Final IA taxonomy + nav labels, and whether planned sections (`/industries`, `/insights`,
  `/careers`) enter the **header** or live only in the **footer** at launch → Marketing.
- Confirm the static **browse/filter** approach over an on-site search index (US-2) → Marketing +
  Platform Architect; revisit if content volume grows materially.
- Mobile-menu pattern (disclosure vs. full-screen overlay) and its exact focus-trap behavior →
  Product Architect + design.

## Sources & traceability
Decision 0012 (capability vs content); live `Base.astro` chrome (real nav, footer, skip-link);
`02/content-types` (the collections nav must reach); `01/audience-and-icp` (wayfinding by
persona/role); Content Management & Publishing and Discoverability (the adjacent capabilities this
one connects but does not duplicate).
