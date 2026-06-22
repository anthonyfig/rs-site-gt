---
id: gt-07-0012-capability-vs-content-definition
title: "0012 — A capability is a function, not a page; add the Content layer"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor) + Product Architect"
status: approved
confidence: high
sources: ["User direction (Jun 2026): 'About' is a page/content, not a capability; need another level of abstraction; define how to identify capabilities", "Delivery v2 deck (capability = unit of value, made of specs/flows)"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["marketing-site", "explorer", "ground-truth"]
related: ["gt-03-index", "gt-02-entities", "gt-07-0007-capability-specs-and-user-stories"]
tags: ["adr", "model", "capabilities", "content"]
---

# 0012 — A capability is a function, not a page; add the Content layer

**Status:** Accepted · **Date:** 2026-06-22 · **Owner:** Anthony

## Context
Part 03 had drifted: pages ("About", "Industries", "Careers", "Home") were modeled as
*capabilities*. A page is **content**, not a function. We were missing a level of abstraction.

## Decision
- A **capability** is a **business function / unit of value** the system performs (a verb), made of
  multiple user stories with acceptance criteria + evals — **not** a page, section, asset, or item.
- Add the **Content** level: **Pages, Collections, Case Studies, Industries, Posts, Media** are
  **Domain-Model entities (Part 02)** that capabilities *operate on*. A specific page is content; its
  behaviour is a **user story** under a content capability.
- The identification rule lives in **rs-ip** (`docs/identifying-capabilities.md`) — the litmus test.

**Levels:** Platform → Capability (function) → User Story (behaviour) → Content (entities).

## Corrected capability set (website)
Lead Capture & Qualification · **Content Management & Publishing** (serves Home/About/How-we-work/
Offering/Careers as content + the Industries collection) · Case Studies & Portfolio · Insights/Blog
Publishing (incl. Webflow migration) · Navigation & Search · Discoverability (SEO/GEO) · Ground Truth
Explorer · Analytics & Measurement.

## Consequences
- **Part 03 restructured:** the page-capabilities (home-positioning, how-we-work, ai-offering-hub,
  about, careers, industries) are removed; their content moves to Part 02 content types + user
  stories under *Content Management & Publishing*. Genuine capabilities are kept/added.
- **Part 02 gains content types** (the content layer).
- Going forward, the litmus test gates whether something is a capability (default to content + a user story).
