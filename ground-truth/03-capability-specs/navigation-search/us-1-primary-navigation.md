---
id: gt-03-us-primary-nav
title: "NAV-1 · Primary navigation (header · footer · mobile menu · CTA)"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Head of Marketing"
status: draft
delivery_status: backlog
confidence: medium
sources:
  - "Capability gt-03-capability-navigation-search"
  - "live: rs-site/apps/marketing/src/layouts/Base.astro (header nav, footer, CTA → /contact)"
  - "gt-02-content-types (collections the nav can reach)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-navigation-search
related: ["gt-03-capability-navigation-search", "gt-03-capability-lead-capture"]
tags: ["navigation", "header", "footer", "mobile", "cta"]
---

# User story: Primary navigation (header · footer · mobile menu · CTA)

> Agent-facing. Implement against these scenarios; an independent eval verifies them.

**As a** visitor on any device **I want** consistent header, footer, and mobile navigation that shows
me where I am and always offers the next step **so that** I can move through the site and start a
Discovery Sprint without getting lost.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | Use header/footer/mobile nav; reach any public section; open the CTA | Reach internal-only or unpublished destinations |
| Keyboard / SR user | Operate every nav control and the mobile menu via keyboard | — |
| AI crawler | Follow the same server-rendered nav links | — |

## Preconditions
- The base layout renders a header (brand → `/`, primary nav, "Start a Discovery Sprint" CTA) and a
  footer; the real nav is **How we work · AI · Work · About** with the CTA pointing to `/contact`.
- Public routes exist or are planned: `/`, `/how-we-work`, `/ai`, `/work`, `/about`, `/contact`
  (planned: `/industries`, `/insights`, `/careers`, `/privacy`).

## Acceptance criteria — scenarios (Given / When / Then)
**Scenario (gt-03-us-primary-nav-AC1): Header nav is present and server-rendered**
- **Given** any page of the site
- **When** it loads (including with JavaScript disabled)
- **Then** the header shows the brand link to `/` and the primary nav (How we work · AI · Work ·
  About), all as real anchor links present in the initial HTML.

**Scenario (gt-03-us-primary-nav-AC2): Current section is indicated**
- **Given** I am on a section page (e.g., `/work`)
- **When** the page renders
- **Then** the matching nav item is marked as current (e.g., `aria-current="page"`) and visually
  distinguished, so I can tell where I am.

**Scenario (gt-03-us-primary-nav-AC3): CTA reachable from every page**
- **Given** any page on any viewport
- **When** I look for the next step
- **Then** the "Start a Discovery Sprint" CTA is reachable — in the header on desktop and inside the
  mobile menu on small screens — and it links to `/contact`.

**Scenario (gt-03-us-primary-nav-AC4): Mobile menu exposes the same destinations**
- **Given** a small-screen viewport where the inline header nav is collapsed
- **When** I open the mobile menu (toggle is labelled, e.g., `aria-expanded`)
- **Then** the same destinations **and** the CTA are available and fully operable by keyboard
  (open, move through items, activate, close with Escape), with focus managed sensibly.

**Scenario (gt-03-us-primary-nav-AC5): Footer navigation**
- **Given** any page
- **When** I scroll to the footer
- **Then** the footer offers stable secondary links (hubs, social, contact email, and — at launch —
  any sections not promoted to the header, e.g., Privacy/Careers), with no placeholder links.

## Definition of done
- [ ] All scenarios pass their evals · keyboard + screen-reader operable (WCAG AA) · header/footer
      server-rendered and crawlable (SEO/LLM) · CTA reachable on every viewport · no placeholder
      labels or dead links (BR-11) · no internal-only destinations (BR-8).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 | `EV-SEO-REGRESSION` | header brand + nav links present in initial HTML on every route |
| AC2 | `EV-NAV` | current section flagged with `aria-current` and a visual state |
| AC3 | `EV-NAV` | CTA → `/contact` present and reachable on desktop and mobile viewports |
| AC4 | `EV-A11Y`, `EV-NAV` | mobile menu opens/closes by keyboard; same destinations + CTA; Escape closes |
| AC5 | `EV-NAV` | footer links resolve (no 404/placeholder); no internal-only links |
| All | `EV-A11Y` | no blocking accessibility violations on the nav |

## Notes / human gates
- Whether `/industries`, `/insights`, `/careers` appear in the **header** vs. **footer-only** at
  launch, and the final nav labels → Marketing.
- Mobile-menu pattern (disclosure panel vs. full-screen overlay) and exact focus behavior →
  Product Architect + design.
