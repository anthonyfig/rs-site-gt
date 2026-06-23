---
id: gt-03-us-wayfinding-a11y
title: "US-3 — Wayfinding & accessibility (breadcrumbs · skip-link · landmarks)"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested)"
status: draft
confidence: medium
sources:
  - "Capability gt-03-capability-navigation-search"
  - "live: rs-site/apps/marketing/src/layouts/Base.astro (skip-link → #main, <main id=\"main\">)"
  - "WCAG 2.1 AA (perceivable/operable navigation)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-navigation-search
related: ["gt-03-capability-navigation-search", "gt-03-capability-content-publishing"]
tags: ["a11y", "wayfinding", "breadcrumbs", "wcag", "landmarks"]
---

# User story: Wayfinding & accessibility (breadcrumbs · skip-link · landmarks)

> Agent-facing. Implement against these scenarios; an independent eval verifies them.

**As a** keyboard or screen-reader user (and any visitor going deep into the site) **I want**
breadcrumbs, a working skip-link, sensible focus order, and clear landmarks **so that** I can orient,
skip repetition, and navigate every page efficiently.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Keyboard / SR user | Skip to main, traverse landmarks, follow breadcrumbs, navigate in a logical focus order | Be trapped or lose focus visibility |
| Visitor (anon) | See where a page sits in the hierarchy via breadcrumbs | — |
| AI crawler | Parse landmark + breadcrumb structure | — |

## Preconditions
- The base layout already provides a skip-link ("Skip to content" → `#main`) and a `<main id="main">`
  landmark; the header nav uses a `nav` with an accessible name ("Primary").

## Acceptance criteria — scenarios (Given / When / Then)
**Scenario (gt-03-us-wayfinding-a11y-AC1): Skip-link works**
- **Given** any page
- **When** I press Tab as the first action
- **Then** the first focusable control is the "Skip to content" link, it is visible on focus, and
  activating it moves focus to the main content (`#main`), past the repeated header.

**Scenario (gt-03-us-wayfinding-a11y-AC2): Landmarks are present and labelled**
- **Given** any page
- **When** a screen reader lists landmarks
- **Then** it finds a `banner` (header), a labelled primary `navigation`, a single `main`, and a
  `contentinfo` (footer) — so the user can jump between regions.

**Scenario (gt-03-us-wayfinding-a11y-AC3): Breadcrumbs on collection detail pages**
- **Given** a collection detail page (e.g., a case study or an industry)
- **When** it renders
- **Then** a breadcrumb trail shows the path (e.g., Home › Work › {Item}), the current item is
  marked as current and not a link, and the trail is exposed as an accessible breadcrumb structure.

**Scenario (gt-03-us-wayfinding-a11y-AC4): Logical, visible focus order**
- **Given** keyboard navigation through a page
- **When** I Tab through interactive elements
- **Then** focus follows a logical reading order, every focused control has a visible focus
  indicator, and there are no keyboard traps.

**Scenario (gt-03-us-wayfinding-a11y-AC5): WCAG AA conformance for navigation**
- **Given** the header, footer, mobile menu, breadcrumbs, and index entry points
- **When** evaluated for accessibility
- **Then** they meet WCAG 2.1 AA (names/roles/values, contrast, focus visibility) with no blocking
  violations.

## Definition of done
- [ ] All scenarios pass their evals · skip-link, landmarks, breadcrumbs, and focus order verified ·
      WCAG 2.1 AA · no placeholder content (BR-11).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 | `EV-A11Y` | skip-link is first stop, visible on focus, moves focus to `#main` |
| AC2 | `EV-A11Y` | banner / labelled nav / single main / contentinfo all present |
| AC3 | `EV-A11Y`, `EV-NAV` | breadcrumb structure on detail pages; current item non-link |
| AC4 | `EV-A11Y` | logical focus order; visible focus; no keyboard trap |
| AC5 | `EV-A11Y` | no blocking WCAG AA violations across navigation |

## Notes / human gates
- Whether breadcrumbs appear on top-level section pages or only on collection detail pages → Product
  Architect + Marketing.
- Any motion/animation in the mobile menu must respect `prefers-reduced-motion` → design.
