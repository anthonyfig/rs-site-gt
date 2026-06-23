---
id: gt-03-us-explorer-ask
title: "US-4 — Ask the Ground Truth (chat with citations)"
part: "03-capability-specs"
type: user-story
owner: "Product Architect (suggested) + Anthony"
status: draft
confidence: medium
sources:
  - "Capability gt-03-capability-explorer"
  - "Decision 0005 — internal-only chat over the Ground Truth via the Anthropic (Claude) API with retrieval"
  - "Decision 0010 — the database engine (pgvector) powers chat, rebuilt from Git"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
capability: gt-03-capability-explorer
related: ["gt-03-capability-explorer", "gt-07-0005-explorer-internal-claude-chat"]
tags: ["explorer", "ask", "chat", "citations"]
---

# User story: Ask the Ground Truth (chat with citations)

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

**As an** internal Rootstrap user **I want** to ask questions of the Ground Truth in plain language
and get answers that cite the artifacts they draw from **so that** I can interrogate the model and
trust each answer back to its source.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Internal user (authenticated) | Ask questions; read answers and follow their citations | Reach the Explorer if not authenticated |
| Ask agent (Anthropic/Claude API + retrieval) | Retrieve from the Ground Truth and answer with citations | Answer for, or cite, internal-only artifacts to a non-internal user; assert facts with no citation |
| Non-internal user | — | Reach Ask or receive any answer drawn from internal-only artifacts (BR-8) |

## Preconditions
- The user is authenticated as an internal Rootstrap user (Decision 0005).
- The engine has indexed the Git-backed Ground Truth for retrieval (pgvector), rebuilt from Git
  (Decision 0010).
- Answers are generated via the **Anthropic (Claude) API** over retrieved Ground Truth content
  (Decision 0005).

## Acceptance criteria — scenarios (Given / When / Then)

**Scenario (gt-03-us-explorer-ask-AC1): Answer cites its artifacts**
- **Given** I ask a question the Ground Truth can answer
- **When** the answer returns
- **Then** it includes **citations to the specific artifacts** it drew from, each of which I can open
  (trace-to-source).

**Scenario (gt-03-us-explorer-ask-AC2): No relevant content — no fabrication**
- **Given** I ask something the Ground Truth does not cover
- **When** retrieval finds nothing relevant
- **Then** the answer says it cannot find it in the Ground Truth rather than inventing an uncited
  claim.

**Scenario (gt-03-us-explorer-ask-AC3): Internal-only**
- **Given** a non-internal user
- **When** they attempt to use Ask
- **Then** they are refused; Ask never returns an answer drawn from internal-only artifacts (BR-8).

**Scenario (gt-03-us-explorer-ask-AC4): Citations resolve to real artifacts**
- **Given** an answer with citations
- **When** I open any cited reference
- **Then** it resolves to a real artifact in the model whose content supports the cited point.

## Definition of done
- [ ] All scenarios pass their evals · keyboard- and screen-reader-operable (WCAG AA) ·
  no placeholder content (BR-11) · answers are grounded in the canonical Git model via retrieval
  (Decisions 0005, 0010).

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 / AC4 | `EV-EXPLORER-ASK` | every substantive claim carries a citation that opens to a real, supporting artifact |
| AC2 | `EV-EXPLORER-ASK` | out-of-scope question yields an honest "not found", not a fabricated claim |
| AC3 | `EV-INTERNAL-LEAK` | no answer drawn from internal-only artifacts reaches a non-internal user |
| AC1 / AC4 | `EV-GT-CONSISTENCY` | cited content matches the canonical Git artifact |
| A11y | `EV-A11Y` | chat is operable by keyboard and screen reader; no blocking violations |

## Notes / human gates
- How citations are **selected and ranked**, and the wording of the "not found" response → Product +
  Anthony.
- This is the Claude **API** powering an internal feature; it is **not** an "Anthropic partner" claim
  and must never be described as one.
