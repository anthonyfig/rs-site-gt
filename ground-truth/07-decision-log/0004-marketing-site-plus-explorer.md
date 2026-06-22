---
id: gt-07-0004-marketing-plus-explorer
title: "0004 — Build two surfaces: marketing site + Ground Truth Explorer"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: approved
confidence: high
sources: ["Project scoping decision (Jun 2026, confirmed in-session)"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["marketing-site", "explorer"]
related: ["gt-07-0002-stack", "gt-03-index"]
tags: ["adr", "scope"]
---

# 0004 — Two surfaces: public marketing site + Ground Truth Explorer

**Status:** Accepted · **Date:** 2026-06-22 · **Owner:** Anthony

## Context
The new site must both *tell* the AI-native story and *prove* it. Telling is a marketing job;
proving is best done by letting visitors experience Ground Truth as a product surface.

## Decision
Build **two surfaces in one repo**: (1) the **public marketing site**, and (2) the **Ground Truth
Explorer** (Ask / Browse / Trace / Validate / Generate) that dogfoods and demonstrates the method
on Rootstrap's own Ground Truth.

## Alternatives considered
- *Marketing site first, Explorer later.* Lower risk, but defers the strongest proof point.
- *Explorer only.* Misses the repositioning + pipeline goal.

## Consequences
- Monorepo + shared Ground Truth package (Decision `0002`).
- Need an Explorer spec (`explorer/SPEC.md`) and its capability spec (Part 03).
- **OQ-2** (Explorer public vs gated) must be decided; gating affects auth + which artifacts are
  served (BR-8).
