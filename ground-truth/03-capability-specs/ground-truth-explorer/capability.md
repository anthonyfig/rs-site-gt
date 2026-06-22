---
id: gt-03-capability-explorer
title: "Capability: Ground Truth Explorer"
part: "03-capability-specs"
type: capability-spec
owner: "Product Architect (suggested) + Anthony"
status: draft
confidence: medium
sources: ["Decision 0012 (a function, not a page)", "Delivery v2 deck (A6 Explorer)", "Decisions 0005 (internal + Claude chat), 0010 (Git-backed UI)", "rs-ip explorer/SPEC.md"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
related: ["gt-07-0005-explorer-internal-claude-chat", "gt-07-0010-git-system-of-record-db-engine", "gt-03-index"]
tags: ["explorer", "internal", "business-twin"]
tier: "C4"
---

# Capability: Ground Truth Explorer

> A core-platform **function** (Decision 0012): the navigable, conversational surface over the
> Ground Truth — the dogfood + proof. Full design in **rs-ip `explorer/SPEC.md`**.

## Purpose
Let stakeholders **Ask / Browse / Trace / Validate / Generate / Ingest** the Ground Truth — and let
Rootstrap demonstrate the method on its own model.

## Capability-level acceptance
- [ ] **Internal-only** (Decision 0005); authenticated; serves only public artifacts to non-internal users (RLS, BR-8).
- [ ] **Chat** over the Ground Truth via the Anthropic (Claude) API; Browse/Trace render artifacts + sources + relationships.
- [ ] **Validate** writes a clean commit to Git on the user's behalf (Decision 0010); **Ingest** proposes placement behind a human gate.

## User stories
Just-in-time (e.g., "Ask over the model", "Browse the graph", "Validate → commit", "Ingest a document"). The v0 navigator (`tools/`) already does Browse/Trace/status.

## Evals
Functional + `EV-GT-CONSISTENCY`, `EV-INTERNAL-LEAK`; defined as built.

## Open questions / human gates
- Auth provider; how "chat" cites artifacts; the validate→commit mechanism (Decision 0010).
