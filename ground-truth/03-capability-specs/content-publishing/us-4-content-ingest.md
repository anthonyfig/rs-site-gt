---
id: gt-03-us-content-ingest
title: "CONTENT-4 · Content ingest (upload → propose → human gate)"
part: "03-capability-specs"
type: user-story
owner: "Platform Architect (suggested) + Head of Marketing"
status: draft
delivery_status: in-progress
confidence: medium
sources: ["Capability gt-03-capability-content-publishing", "Decision 0008 (intelligent ingest)", "Decision 0013 (Sanity Studio = the no-code editor)", "gt-02-business-rules (BR-5/8)"]
updated: 2026-06-23
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer", "marketing-site"]
capability: gt-03-capability-content-publishing
related: ["gt-03-capability-content-publishing", "gt-07-0008-ground-truth-database-backed-and-media", "gt-07-0013-marketing-content-in-sanity", "gt-05-sanity"]
tags: ["ingest", "human-gate"]
---

# User story: Content ingest (upload → propose → human gate)

**As a** marketing editor **I want** to upload/author content and have it placed for review **so that**
I publish without engineering.

> **Authoring surface (Decision 0013): Sanity Studio.** For marketing content (case studies,
> blog/insights), the no-code editor + human gate is **Sanity Studio** — editors author as drafts and
> **Publish** (the human gate; AC2), which triggers an Astro rebuild. Schemas scaffolded in
> `rs-site/apps/studio`. The AI *ingest-proposes-placement* flow (AC1, Decision 0008) remains the
> richer optional automation on top; the baseline no-code path is now Sanity.

## Acceptance criteria — scenarios
**Scenario (US-content-ingest-AC1): Ingest proposes placement**
- **Given** I upload a document/media
- **Then** an agent drafts the content instance, attaches media, and **proposes** where it belongs — as `status: draft` for review.

**Scenario (US-content-ingest-AC2): Human gate — no auto-publish**
- **Then** nothing publishes until I approve (Decision 0008 / BR-5).

**Scenario (US-content-ingest-AC3): No internal leak**
- **Then** internal figures in the source are flagged and excluded (BR-8).

## Definition of done
- [ ] Scenarios pass · reviewable draft with traced sources · human approval required.

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-INGEST-PLACEMENT` | proposes correct placement; sources traced |
| AC2 | `EV-HUMAN-GATE` | no publish without approval |
| AC3 | `EV-INTERNAL-LEAK` | internal data excluded |

## Notes / human gates
- Editor confirms placement + rights before publish.
