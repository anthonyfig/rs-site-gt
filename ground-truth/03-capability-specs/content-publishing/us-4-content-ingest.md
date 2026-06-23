---
id: gt-03-us-content-ingest
title: "CONTENT-4 · Content ingest (upload → propose → human gate)"
part: "03-capability-specs"
type: user-story
owner: "Platform Architect (suggested) + Head of Marketing"
status: draft
delivery_status: backlog
confidence: medium
sources: ["Capability gt-03-capability-content-publishing", "Decision 0008 (intelligent ingest)", "gt-02-business-rules (BR-5/8)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer", "marketing-site"]
capability: gt-03-capability-content-publishing
related: ["gt-03-capability-content-publishing", "gt-07-0008-ground-truth-database-backed-and-media"]
tags: ["ingest", "human-gate"]
---

# User story: Content ingest (upload → propose → human gate)

**As a** marketing editor **I want** to upload/author content and have it placed in the Ground Truth
for review **so that** I publish without engineering.

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
