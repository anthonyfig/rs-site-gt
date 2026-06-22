---
id: gt-07-0001-adopt-ground-truth-blueprint
title: "0001 — Adopt the Ground Truth Blueprint; this site is the pilot"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: approved
confidence: high
sources:
  - "Project instructions (Jun 2026)"
  - "Delivery v2 deck — /sources/ai-native-delivery.html (A5 blueprint, A6 explorer)"
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["ground-truth", "marketing-site", "explorer"]
related: ["gt-02-vocabulary"]
tags: ["adr", "method"]
---

# 0001 — Adopt the Ground Truth Blueprint as the operating model

**Status:** Accepted · **Date:** 2026-06-22 · **Owner:** Anthony (sponsor)

## Context
Rootstrap is shifting to AI-native delivery, where **Ground Truth is the durable asset** and
software is derived from it. The Delivery v2 deck specifies a standard 7-part blueprint (A5) and a
navigable Explorer (A6). We need a concrete, repeatable instantiation — and a first project to
prove it on.

## Decision
Adopt the **7-part Ground Truth Blueprint** (Project Context, Domain Model, Capability Specs,
Engineering Context, Integration Contracts, Eval Suite, Decision Log), with **per-artifact
metadata** (owner, status, source, confidence, last-validated, applies-to) as the standard shape
of Ground Truth on **every** project. **This website project is the pilot** and the dogfood
reference.

## Alternatives considered
- *Keep ad-hoc docs per project.* Rejected — not reusable, not validatable, the failure mode the
  deck calls out ("if it isn't structured, owned, versioned and validated, it isn't Ground Truth").
- *Buy/adopt a third-party knowledge tool.* Deferred — start as version-controlled files
  (portable, diffable, agent-readable); the Explorer is the product surface on top.

## Consequences
- Every artifact must carry metadata and a validation state; "unowned" is not allowed.
- Agents build production software only from `approved` artifacts (BR-1).
- Success of the pilot = a validated Ground Truth that the new site is demonstrably derived from,
  reusable as a client-facing reference.
