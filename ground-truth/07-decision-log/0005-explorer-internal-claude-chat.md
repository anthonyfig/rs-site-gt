---
id: gt-07-0005-explorer-internal-claude-chat
title: "0005 — Explorer is internal-only, with Claude-powered chat over Ground Truth"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: approved
confidence: high
sources: ["User decision (Jun 2026): Explorer internal-only; 'chat with my ground truth' via Anthropic API"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["explorer"]
related: ["gt-04-stack-and-architecture", "gt-05-index", "gt-07-0004-marketing-plus-explorer"]
tags: ["adr", "explorer", "scope"]
---

# 0005 — Explorer internal-only, with Claude-powered chat

**Status:** Accepted · **Date:** 2026-06-22 · **Owner:** Anthony · (Closes OQ-2)

## Decision
The Ground Truth Explorer is **internal-only** (authenticated Rootstrap users). Its headline
feature is **"chat with your Ground Truth"**, powered by the **Anthropic (Claude) API** with
retrieval (pgvector) over the Ground Truth files. It is not a public proof surface.

## Rationale
- The Explorer holds the full model, including internal-only data (BR-8) — internal access avoids
  that exposure entirely.
- A conversational interface is the most natural way to interrogate/validate the model.
- Public proof + LLM-discovery is the **marketing site's** job, not the Explorer's.

## Consequences
- Auth required; RLS scopes internal visibility. Needs an **Anthropic API key** (server-side, env).
- "Ask" mode = Claude API + retrieval; "Browse/Trace/Validate/Generate" as in `explorer/SPEC.md`.
- Public-vs-internal content boundary (OQ-8) stays relevant only for the marketing site.
