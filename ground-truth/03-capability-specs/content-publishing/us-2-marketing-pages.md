---
id: gt-03-us-content-marketing-pages
title: "CONTENT-2 · Present the marketing pages from content"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested)"
status: draft
delivery_status: shipped
confidence: medium
sources: ["Capability gt-03-capability-content-publishing", "gt-01-goals-and-scope", "gt-01-audience-and-icp", "gt-02-entities"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-content-publishing
related: ["gt-03-capability-content-publishing", "gt-02-content-types", "gt-03-capability-lead-capture"]
tags: ["pages", "marketing", "content"]
---

# User story: Present the marketing pages from content

**As a** visitor **I want** the marketing pages **so that** I understand Rootstrap and can act. The
pages are **content instances** (`02/content-types`); this story presents them.

## Acceptance criteria — scenarios
**Scenario (US-content-mktg-AC1): Each page presents its intended content**
- **Given** the content sourced from Part 01 (positioning, audience) + Part 02 (offering, proof):
  - **Home** — agentic-first hero + trust/proof bar + persona paths
  - **About** — company story (values, hubs, 14 yrs) + recognition/trust
  - **How we work** — the method (agents/loops/evals/gates) + the dogfood proof
  - **AI offering** — the four pillars + AI Discovery Sprint + "what clients ask" FAQ
  - **Careers** — roles + the AI-native way of working
- **Then** each renders that content, agentic-first (heritage as proof, not headline).

**Scenario (US-content-mktg-AC2): Claims accurate + CTAs route to lead capture**
- **Then** claims are accurate (verified stats BR-7; SOC 2 ✅ / Anthropic-certified ✅ / **not** "partner" BR-12; no internal data BR-8)
- **And** primary CTAs enter `gt-03-capability-lead-capture`.

## Definition of done
- [ ] Both scenarios pass · server-rendered · WCAG AA · no placeholder.

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-SEO-REGRESSION`, `EV-GEO` | pages render intended content in HTML; assistants describe Rootstrap as AI-native |
| AC2 | `EV-DATA`, `EV-INTERNAL-LEAK`, `EV-LEAD-HAPPY` | accurate claims; no internal data; CTA reaches lead capture |

## Notes / human gates
- Final copy per page → Marketing (the *intent* is in Part 01/02; the words are content).
