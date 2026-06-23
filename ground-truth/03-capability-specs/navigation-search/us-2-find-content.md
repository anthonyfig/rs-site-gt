---
id: gt-03-us-find-content
title: "NAV-2 · Find content across collections"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested) + Platform Architect"
status: draft
delivery_status: backlog
confidence: medium
sources:
  - "Capability gt-03-capability-navigation-search"
  - "gt-02-content-types (Collection: Insights · Case Studies · Industries)"
  - "gt-03-capability-content-publishing (US-3 collection browse/filter/detail)"
  - "Decision 0010 (Git is system of record) — static-site build"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-navigation-search
related: ["gt-03-capability-navigation-search", "gt-03-capability-content-publishing", "gt-02-content-types"]
tags: ["search", "browse", "filter", "findability", "collections"]
---

# User story: Find content across collections

> Agent-facing. Implement against these scenarios; an independent eval verifies them.

**As a** visitor looking for something specific (a relevant case study, an Insights post, an
industry) **I want** clear, browsable indexes for each collection **so that** I can find the content
I need without relying on a search box.

> **Chosen approach (and why):** clear **browse/filter indexes**, *not* an on-site search engine.
> The site is a static Astro build (Decision 0010) with small, curated collections (Insights, Case
> Studies, Industries). Well-structured, filterable, deep-linkable indexes meet the need with no
> server, index, or query infrastructure — simpler to build, faster, and fully crawlable. (The
> *rendering* of each index lives in Content Management & Publishing US-3; this story owns the
> **entry points and findability guarantee** across collections.) Revisit only if content volume
> grows enough that browsing stops scaling.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | Reach each collection index; browse and filter; open an item | See unpublished/internal items |
| Keyboard / SR user | Operate index entry points and filters by keyboard | — |
| AI crawler | Discover items by following index links in the HTML | — |

## Preconditions
- Collections exist with browsable indexes: **Insights** (`/insights`), **Case Studies** (within
  `/work`), **Industries** (`/industries`). Their detail rendering is provided by Content
  Management & Publishing / Case-study showcase.

## Acceptance criteria — scenarios (Given / When / Then)
**Scenario (gt-03-us-find-content-AC1): Every collection has a reachable index**
- **Given** the published collections (Insights, Case Studies, Industries)
- **When** I navigate from the header, footer, or a related page
- **Then** each collection's index is reachable in at most a couple of clicks, and the index lists
  its items server-rendered (present in the initial HTML).

**Scenario (gt-03-us-find-content-AC2): Browse and filter to narrow down**
- **Given** a collection index with more items than fit one glance
- **When** I apply a filter (e.g., Case Studies by industry, Insights by topic)
- **Then** only matching items show **and** the URL reflects the filter, so the view is
  deep-linkable and shareable.

**Scenario (gt-03-us-find-content-AC3): No dead end — helpful empty state**
- **Given** a filter combination with no matches
- **When** results are empty
- **Then** I see a helpful empty state with a way to reset/broaden, not a blank screen.

**Scenario (gt-03-us-find-content-AC4): Cross-collection discovery**
- **Given** I am reading one item (e.g., a case study)
- **When** I reach the end
- **Then** I see clear links onward (back to the index and/or to related content), so I can keep
  exploring without using browser back repeatedly.

## Definition of done
- [ ] All scenarios pass their evals · indexes server-rendered and crawlable · filters keyboard +
      screen-reader operable (WCAG AA) · empty states present · no placeholder content (BR-11) ·
      no internal-only items exposed (BR-8) · no on-site search dependency introduced.

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 | `EV-NAV`, `EV-SEO-REGRESSION` | each index reachable ≤2 clicks; items present in initial HTML |
| AC2 | `EV-NAV` | filtered subset correct; URL reflects the filter |
| AC3 | `EV-NAV` | empty state with reset shown (no blank screen) |
| AC4 | `EV-NAV` | onward links present at end of detail items |
| All | `EV-A11Y` | filters/links operable; no blocking violations |

## Notes / human gates
- Confirm the static browse/filter approach over an on-site search index → Marketing + Platform
  Architect; reopen if collection volume grows materially.
- Filter taxonomies (topics for Insights, sectors for Industries) → Marketing (the Case-study
  filter taxonomy is owned by the Case-study showcase capability).
