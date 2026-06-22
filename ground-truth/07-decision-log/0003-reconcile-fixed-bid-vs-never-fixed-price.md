---
id: gt-07-0003-reconcile-fixed-bid-vs-never-fixed-price
title: "0003 — Fixed-bid reconciliation is out of scope (internal project)"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: approved
confidence: high
sources:
  - "User decision (Jun 2026): 'don't worry about this on this project, it's an internal project'"
  - "Notion: AI Delivery Playbook v1.0 (BR-2) + Delivery v2 deck (BR-3)"
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["marketing-site"]
related: ["gt-02-business-rules", "gt-01-non-goals-and-open-questions"]
tags: ["adr", "pricing", "out-of-scope"]
---

# 0003 — Fixed-bid reconciliation is out of scope for this project

**Status:** Accepted (deferred to company level) · **Date:** 2026-06-22 · **Owner:** Anthony

## Context
There is an apparent tension in how Rootstrap *prices client AI work*: the AI Delivery Playbook
says **never fixed-price L2/L3 AI without a paid discovery** (BR-2), while Delivery v2 says
**fixed-bid validated capabilities** become possible (BR-3). Earlier this was raised as a project
open question (OQ-6).

## Decision
**Do not resolve this within the website project.** This site is an **internal Rootstrap
project** — there is no client fixed-bid involved in building it, so the tension does not gate any
work here. The reconciliation is a **company-level go-to-market question**, owned outside this
project.

## Consequences
- **OQ-6 is closed as out-of-scope** for this project (see `01/non-goals-and-open-questions.md`).
- **BR-2 / BR-3 remain recorded** in the Domain Model as true operating facts (useful reference,
  and relevant if/when pricing copy is written), but they are **not action items** for this project.
- If site copy later needs to make a pricing claim, it inherits whatever the company decides
  elsewhere; this project does not invent or reconcile that position.
