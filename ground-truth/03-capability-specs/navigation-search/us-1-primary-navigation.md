---
id: gt-03-us-primary-nav
title: "NAV-1 · Primary navigation (header · footer · mobile menu · CTA)"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Head of Marketing"
status: in-review
delivery_status: in-progress
confidence: medium
sources:
  - "Capability gt-03-capability-navigation-search"
  - "live: rs-site/apps/marketing/src/layouts/Base.astro (header nav + Capabilities mega, footer, mobile menu, CTA → /contact) — reconciled 2026-06-24"
  - "gt-02-content-types (collections the nav can reach)"
updated: 2026-06-24
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
conversation without getting lost.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | Use header/footer/mobile nav; open the Capabilities menu; reach any public section; open the CTA | Reach internal-only or unpublished destinations |
| Keyboard / SR user | Operate every nav control, the Capabilities menu, and the mobile menu via keyboard | — |
| AI crawler | Follow the same server-rendered nav links | — |

## Preconditions
- The base layout renders a header (brand → `/`, primary nav, "Get Started" CTA) and a footer.
- The real primary nav is **Capabilities · Services · Portfolio · About · Blog · Hiring**, where
  **Capabilities** is a mega menu (capability cards + technology links → `/capabilities/<slug>` +
  a "View all capabilities →" link → `/capabilities`) and the other items link to `/services`,
  `/work`, `/about`, `/blog`, `/careers` respectively. The CTA is **"Get Started →"** → `/contact`.
- Public routes exist: `/`, `/capabilities` (+ `/capabilities/<slug>`), `/services`, `/work`
  (+ `/work/<slug>`), `/about`, `/blog` (+ posts), `/careers`, `/contact`, `/industries`, `/privacy`.

## Acceptance criteria — scenarios (Given / When / Then)
**Scenario (gt-03-us-primary-nav-AC1): Header nav is present and server-rendered**
- **Given** any page of the site
- **When** it loads (including with JavaScript disabled)
- **Then** the header shows the brand link to `/` and the primary nav (Capabilities · Services ·
  Portfolio · About · Blog · Hiring), all as real anchor links present in the initial HTML.

**Scenario (gt-03-us-primary-nav-AC2): Current section is indicated**
- **Given** I am on a section page (e.g., `/work`)
- **When** the page renders
- **Then** the matching nav item is marked as current (e.g., `aria-current="page"`) and visually
  distinguished, so I can tell where I am.
- **Status:** ✅ implemented (rs-site PR #23, 2026-06-24) — `aria-current="page"` on the matching
  header + mobile nav item via path-prefix match, with a non-color-only visual cue (font-weight).

**Scenario (gt-03-us-primary-nav-AC3): CTA reachable from every page**
- **Given** any page on any viewport
- **When** I look for the next step
- **Then** the "Get Started" CTA is reachable — in the header on desktop and inside the mobile menu
  on small screens — and it links to `/contact`.

**Scenario (gt-03-us-primary-nav-AC4): Mobile menu exposes the same destinations**
- **Given** a small-screen viewport where the inline header nav is collapsed
- **When** I open the mobile menu (toggle is labelled, e.g., `aria-expanded`)
- **Then** the same destinations (Capabilities + Services · Portfolio · About · Blog · Hiring)
  **and** the "Get Started" CTA are available and fully operable by keyboard (open, move through
  items, activate, close with Escape), with focus managed sensibly.

**Scenario (gt-03-us-primary-nav-AC5): Footer navigation**
- **Given** any page
- **When** I scroll to the footer
- **Then** the footer offers stable secondary links — **Company** (About · Industries · Careers ·
  Contact), **Follow** (LinkedIn · X · Instagram · YouTube), the office hubs, a Privacy link, and a
  contact email (`info@rootstrap.com`) — with no placeholder or dead links.

**Scenario (gt-03-us-primary-nav-AC6): Capabilities mega menu**
- **Given** the header on a desktop viewport
- **When** I hover or keyboard-focus the "Capabilities" item
- **Then** a mega menu reveals the capability cards, technology links (→ `/capabilities/<slug>`),
  and a "View all capabilities →" link (→ `/capabilities`); it is operable on hover **and** by
  keyboard (focus-within), and every link is a real server-rendered anchor in the initial HTML.

## Definition of done
- [ ] All scenarios pass their evals · keyboard + screen-reader operable (WCAG AA) · header/footer
      server-rendered and crawlable (SEO/LLM) · CTA reachable on every viewport · no placeholder
      labels or dead links (BR-11) · no internal-only destinations (BR-8).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 | `EV-SEO-REGRESSION` | header brand + nav links (Capabilities · Services · Portfolio · About · Blog · Hiring) present in initial HTML on every route |
| AC2 | `EV-NAV` | current section flagged with `aria-current` and a visual state |
| AC3 | `EV-NAV` | CTA "Get Started" → `/contact` present and reachable on desktop and mobile viewports |
| AC4 | `EV-A11Y`, `EV-NAV` | mobile menu opens/closes by keyboard; same destinations + CTA; Escape closes |
| AC5 | `EV-NAV` | footer links resolve (no 404/placeholder); no internal-only links |
| AC6 | `EV-A11Y`, `EV-NAV` | Capabilities mega opens on hover and focus-within; capability/tech links + "View all" resolve |
| All | `EV-A11Y` | no blocking accessibility violations on the nav |

## Notes / human gates
- **Resolved against the live IA (2026-06-24):** `Careers` appears in the **header** as "Hiring"
  (→ `/careers`); `Industries` is **footer-only** (→ `/industries`); the blog hub is "Blog"
  (→ `/blog`); capability pages are reached through the **Capabilities mega menu** rather than
  individual top-level items. Earlier draft labels ("How we work · AI · Work · About" + a
  "Start a Discovery Sprint" CTA) are superseded.
- AC2 (current-section `aria-current`) implemented in `Base.astro` (rs-site PR #23, 2026-06-24).
- Mobile-menu pattern (disclosure panel vs. full-screen overlay) and exact focus behavior →
  Product Architect + design.
