---
id: gt-03-us-case-study-upload-ingest
title: "CASE-3 · Upload case-study materials (intelligent ingest)"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested) + Product Architect"
status: draft
delivery_status: backlog
confidence: medium
sources: ["Capability gt-03-capability-case-study-showcase", "Decision 0008 (DB-backed, media, intelligent ingest)", "BR-5 (human gates), BR-8"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer", "marketing-site"]
capability: gt-03-capability-case-study-showcase
related: ["gt-03-capability-case-study-showcase", "gt-07-0008-ground-truth-database-backed-and-media", "gt-02-business-rules"]
tags: ["ingest", "media", "human-gate", "upload"]
---

# User story: Upload case-study materials (intelligent ingest)

> This is the story that exercises Decision 0008: upload → the system places it in the Ground
> Truth → a human approves. The agent **proposes**; it never publishes on its own.

**As a** marketing editor **I want** to upload a case study's materials (deck, images, video,
metrics) and have the system place them in the Ground Truth for my review **so that** I can publish
proof without engineering.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Marketing editor | Upload materials; review, edit, approve the proposed draft | — |
| Ingest agent | Read/classify the upload; draft an artifact; attach media; **propose** placement | Publish; overwrite approved truth; decide ambiguity |

## Preconditions
- The Explorer's upload interface and Storage are available (Supabase); the editor is authenticated.

## Acceptance criteria — scenarios
**Scenario: Ingest proposes placement**
- **Given** the editor uploads a deck + images for "Acme"
- **When** ingest runs
- **Then** the agent extracts content, drafts a `case-study` artifact (problem/approach/outcome + metrics), attaches the images as `media-asset`s, and **proposes where it sits** — all as `status: draft` for review.

**Scenario: Human gate — no auto-publish (Decision 0008 / BR-5)**
- **Given** a proposed draft
- **When** the editor has not approved it
- **Then** nothing is published; approval is required to move it toward `approved`.

**Scenario: Media stored + attached**
- **Then** images/video are stored in Storage and linked to the case-study artifact (not pasted into text).

**Scenario: Internal data flagged, not published (BR-8)**
- **Given** the source deck contains revenue/deal figures
- **Then** ingest flags them as internal and excludes them from any public-facing draft.

## Definition of done
- [ ] All scenarios pass · agent output is a reviewable draft with traceable sources · human approval required · internal data never auto-published.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Placement | `EV-INGEST-PLACEMENT` | proposes the correct artifact/part; sources traced |
| Human gate | `EV-HUMAN-GATE` | no publish without approval |
| Internal data | `EV-INTERNAL-LEAK` | internal figures flagged, excluded |

## Notes / human gates
- The editor confirms placement and rights before publish. Ambiguous placement → ask, don't guess.
