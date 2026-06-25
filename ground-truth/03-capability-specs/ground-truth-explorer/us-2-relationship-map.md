---
id: gt-03-us-explorer-map
title: "EXPLORER-2 · Explore one artifact's relationships (focus + context)"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Anthony"
status: draft
delivery_status: shipped
confidence: medium
sources:
  - "Capability gt-03-capability-explorer"
  - "Decision 0010 — relationships derive from the Git-backed model via the engine"
  - "rs-ip explorer/SPEC.md (Trace / relationship view)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
capability: gt-03-capability-explorer
related: ["gt-03-capability-explorer", "gt-03-us-explorer-table"]
tags: ["explorer", "relationships", "focus-context"]
---

# User story: Explore one artifact's relationships (focus + context)

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

**As an** internal Rootstrap user **I want** a relationship view that centers one artifact and shows
only its direct connections, recentering when I click a neighbor **so that** I can follow how the
model fits together without facing a global tangle.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Internal user (authenticated) | Center an artifact, see its direct connections, recenter on click, go back | Reach the Explorer if not authenticated; render the whole graph at once |
| Non-internal user | — | Reach the map or see any internal-only artifact (BR-8) |

## Preconditions
- The user is authenticated as an internal Rootstrap user (Decision 0005).
- Relationships (`related` edges, capability→story links, sources) are derived from the Git-backed
  model via the engine (Decision 0010).
- The Relationship Map is a **distinct section** of the Explorer, not the default landing surface —
  the table/browse (US-1) is the core.

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-explorer-map-AC1): Center one artifact, direct connections only**
- **Given** I open the Relationship Map for a chosen artifact
- **When** the view renders
- **Then** that artifact is **centered** and only its **direct** connections are shown — never the
  full global graph.

**Scenario (gt-03-us-explorer-map-AC2): Recenter on click**
- **Given** the centered artifact and its direct neighbors
- **When** I click a neighbor
- **Then** the view **recenters** on that neighbor and now shows **its** direct connections.

**Scenario (gt-03-us-explorer-map-AC3): Back to retrace**
- **Given** I have recentered one or more times
- **When** I go back
- **Then** the view returns to the previously centered artifact, so I can retrace my path.

**Scenario (gt-03-us-explorer-map-AC4): Open the centered artifact**
- **Given** an artifact is centered
- **When** I choose to open it
- **Then** I land on that artifact's detail view (US-1) with its metadata and sources.

**Scenario (gt-03-us-explorer-map-AC5): Never the global tangle**
- **Given** an artifact with many indirect connections across the whole model
- **When** the map renders for it
- **Then** only its **direct** neighbors appear — the global "hairball" is never drawn.

**Scenario (gt-03-us-explorer-map-AC6): No internal leak**
- **Given** a non-internal user
- **When** they attempt to reach the map
- **Then** they are refused and no internal-only artifact (BR-8) is ever shown.

## Definition of done
- [ ] All scenarios pass their evals · keyboard- and screen-reader-operable (WCAG AA) ·
  no placeholder content (BR-11) · the map is one section, not the centerpiece (the table is the
  core, US-1).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 / AC2 / AC3 / AC5 | `EV-EXPLORER-MAP` | exactly one artifact centered; only direct neighbors rendered; click recenters; back restores prior center; no global graph |
| AC4 | `EV-GT-CONSISTENCY` | centered artifact's edges and metadata match the canonical Git model |
| AC6 | `EV-INTERNAL-LEAK` | no internal-only artifact is served to a non-internal user |
| A11y | `EV-A11Y` | map is operable by keyboard and screen reader; no blocking violations |

## Notes / human gates
- Which edge types are shown (e.g. `related`, capability→story, source links) and how many neighbors
  before truncation → Product.
