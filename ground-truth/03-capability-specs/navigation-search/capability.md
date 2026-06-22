---
id: gt-03-capability-navigation-search
title: "Capability: Navigation & Search"
part: "03-capability-specs"
type: capability-spec
owner: "Product Architect (suggested)"
status: draft
confidence: medium
sources: ["Decision 0012 (a function reused across all content)", "KB navigation research (rs-ip)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-03-capability-content-publishing", "gt-03-index"]
tags: ["navigation", "search", "ia"]
tier: "C2"
---

# Capability: Navigation & Search

> A **function** reused across all content (Decision 0012): help a visitor find anything fast.

## Purpose
Let visitors navigate the site and search across its content in plain, non-technical language.

## Capability-level acceptance
- [ ] Navigation reflects the information architecture in user language (not internal jargon); server-rendered; WCAG AA.
- [ ] Search returns relevant content with sensible empty/typo handling.

## User stories
Written just-in-time (e.g., "global nav", "site search", "breadcrumbs").

## Evals
`EV-A11Y`, `EV-SEO-REGRESSION`, plus a functional search eval (to register).

## Open questions / human gates
- Search scope (pages only vs. pages + insights + case studies) → Marketing/Platform.
