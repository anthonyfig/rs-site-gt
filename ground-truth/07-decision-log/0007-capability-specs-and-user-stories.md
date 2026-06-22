---
id: gt-07-0007-capability-specs-and-user-stories
title: "0007 — Capability specs (human) + user stories (agent) as first-class artifacts"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: approved
confidence: high
sources: ["User direction (Jun 2026): user stories are how agents communicate; differentiate capability spec (human) from user-story spec (agent)"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["marketing-site", "explorer", "ground-truth"]
related: ["gt-03-index", "gt-02-entities", "gt-06-index"]
tags: ["adr", "specs", "user-stories", "method"]
---

# 0007 — Capability specs (human) + user stories (agent)

**Status:** Accepted · **Date:** 2026-06-22 · **Owner:** Anthony

## Context
Agents execute and verify work from written specs. We need a clean split between the human-facing
"what & why" and the agent-facing executable unit — and user stories, written properly, are how
agents communicate and self-check.

## Decision
Both are **first-class Ground Truth artifacts**, with full metadata and validation:

- **Capability spec — human-facing.** The unit of *value*: purpose, actors, outcomes, scope,
  capability-level acceptance criteria, the **list of its user stories**, and links to evals.
  Stakeholders validate capabilities.
- **User story — agent-facing.** One file each, **many per capability**. *As a `<actor>`, I want
  `<goal>`, so that `<benefit>`* + actors + preconditions + **acceptance criteria as Given/When/Then
  scenarios** + definition of done + the evals it maps to + `capability` (parent).

**Hierarchy:** Platform → Capability → User Stories → Acceptance criteria/scenarios → Evals →
Implementation (the Delivery v2 chain; user stories are the "Specs" layer).

## Guardrail
User stories are **communication + acceptance** units — **not** estimation/velocity tokens. We do
not recreate story points (the deck explicitly retires that).

## Consequences
- New `type: user-story`; a `capability:` link on stories; a user-story template.
- The capability-spec template becomes human-facing and links its stories.
- Every story's Given/When/Then maps to ≥1 eval (`06`); a capability is "done" when its stories' evals pass.
