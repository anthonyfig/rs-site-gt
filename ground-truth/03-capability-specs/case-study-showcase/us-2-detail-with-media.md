---
id: gt-03-us-case-study-detail-media
title: "CASE-2 · Rich case-study detail with media"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
delivery_status: shipped
confidence: medium
sources: ["Capability gt-03-capability-case-study-showcase", "Decision 0008 (media)", "BR-7, BR-8"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-case-study-showcase
related: ["gt-03-capability-case-study-showcase", "gt-02-business-rules", "gt-04-seo-and-llm-discovery"]
tags: ["case-studies", "media", "seo"]
---

# User story: Rich case-study detail with media

**As a** visitor **I want** a rich case-study detail page (problem → approach → outcome, metrics,
images/video) **so that** I can judge Rootstrap's credibility for my situation.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | Read the study + its media | See internal financials / unpublished media |

## Preconditions
- A published case study with body, verified metrics, and attached `media-asset`s (Decision 0008).

## Acceptance criteria — scenarios
**Scenario: Structure + media render**
- **Given** a case study with images/video
- **When** I open it
- **Then** I see problem → approach → outcome, the metrics, and the media rendered responsively.

**Scenario: Verified metrics only (BR-7)**
- **Given** published metrics
- **When** the page renders
- **Then** each metric traces to a verified source; any unverified number is omitted, not shown.

**Scenario: No internal financials (BR-8)**
- **Given** the source materials may contain revenue/deal data
- **Then** none of it appears on the public page.

**Scenario: Discoverable**
- **Then** the page is server-rendered and emits schema.org structured data (Article/CreativeWork + Organization).

## Definition of done
- [ ] All scenarios pass · responsive media · WCAG AA · structured data valid · no placeholder content.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| Structure + media | `EV-CS-DETAIL` | renders sections + media responsively |
| Verified metrics | `EV-DATA` | only verified numbers render |
| No internal data | `EV-INTERNAL-LEAK` | 0 internal figures on public page |
| Discoverable | `EV-SEO-REGRESSION` | server-rendered + valid structured data |

## Notes / human gates
- Per-client media/quote/logo rights must be confirmed before publish (Marketing + legal).
