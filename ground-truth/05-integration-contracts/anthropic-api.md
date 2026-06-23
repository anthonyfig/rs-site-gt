---
id: gt-05-anthropic-api
title: "Integration Contract — Anthropic (Claude) API (Explorer 'Ask the Ground Truth')"
part: "05-integration-contracts"
type: integration-contract
owner: "Product Architect (suggested) + Anthony"
status: draft
confidence: medium
sources:
  - "gt-07-0005-explorer-internal-claude-chat (internal-only chat over Ground Truth via the Anthropic/Claude API + retrieval)"
  - "gt-03-us-explorer-ask (cite artifacts; 'not found' over fabrication; internal-only; server-side key)"
  - "User decision (Jun 2026): 'chat with my ground truth' via the Anthropic API"
  - "Reference impl: rs-site-gt/tools/ground-truth/ask.mjs (CLI; verified live, claude-sonnet-4-6)"
updated: 2026-06-23
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer"]
related: ["gt-03-capability-explorer", "gt-07-0005-explorer-internal-claude-chat", "gt-05-index", "gt-02-business-rules"]
tags: ["anthropic", "claude", "explorer", "ask", "citations", "contract"]
---

# Integration Contract — Anthropic (Claude) API ("Ask the Ground Truth")

The Explorer's headline feature, **"Ask the Ground Truth,"** answers internal questions in plain
language by **using the Anthropic (Claude) API** server-side, over retrieval of the Ground Truth
artifacts (Decision 0005). Every answer must **cite the artifacts it used** or honestly say it
**cannot find it** — never fabricate.

> **Wording guardrail (BR-12):** describe this only as *using the Anthropic (Claude) API* to power an
> internal feature. This is **not** an "Anthropic partner" claim and must never be implied. If a
> credential claim is relevant at all, the only allowed phrasing is **"Anthropic-certified teams."**

## Purpose
Let an authenticated internal Rootstrap user interrogate and validate the model conversationally, and
trust each answer back to its source via citations (gt-03-us-explorer-ask). It is an internal
validation surface, **not** a public proof surface (Decision 0005).

## Reference implementation (CLI)
A working server-side reference client exists at `rs-site-gt/tools/ground-truth/ask.mjs` (zero-dep
Node). It loads the Anthropic API key from the environment / `.env` (**never** client-side), retrieves
the top-matching Ground Truth artifacts (keyword ranking; the web Explorer will use pgvector), and
calls the Claude API with a system instruction to **answer only from the provided artifacts, cite
their ids, and say "not in the Ground Truth" otherwise**. Verified live (model `claude-sonnet-4-6`).
This proves the contract's core (cite-or-decline) at the CLI; the web feature adds auth + RLS (AC3)
and pgvector retrieval. Run: `node tools/ground-truth/ask.mjs "question"` (or `--retrieval-only`).

## Trigger
An authenticated internal user submits a question in the Explorer's "Ask" mode. Each question
triggers a retrieval pass over the indexed Ground Truth, then a server-side call to the Claude API.

## Direction
- **Retrieval:** Explorer backend reads the indexed Ground Truth artifacts (pgvector mirror).
- **Generation:** Explorer backend → **Anthropic (Claude) API** (server-side request/response).
- The Claude API is **never** called from the client; the browser talks only to our backend.

## Payload / fields
**Request to Claude API (server-side):**
| Field | Notes |
|-------|-------|
| System/instructions | answer only from retrieved Ground Truth; cite artifacts; say "not found" if unsupported |
| Retrieved context | top-matching Ground Truth chunks (artifact id + content) from pgvector |
| User question | the internal user's plain-language query |

**Response surfaced to the user:**
| Field | Notes |
|-------|-------|
| Answer text | grounded in the retrieved artifacts |
| Citations | the specific artifact ids/paths used, each openable (trace-to-source; AC1/AC4) |
| "Not found" | honest no-answer when retrieval finds nothing relevant (AC2) |

## Auth & secrets
- The **Anthropic API key is handled server-side only** (env/secret store) — **never** shipped to or
  reachable from the client (Decision 0005; gt-03-us-explorer-ask).
- Explorer access itself requires authentication as an internal Rootstrap user; RLS scopes what
  content retrieval may surface.

## Failure handling
- **No relevant content → no fabrication.** If retrieval returns nothing supporting, the answer
  states it cannot find it in the Ground Truth rather than inventing an uncited claim
  (AC2, `EV-EXPLORER-ASK`).
- **Every substantive claim must carry a citation** that opens to a real, supporting artifact; an
  answer that would assert facts without a citation is a failure (AC1/AC4).
- Claude API error/timeout → surface a graceful failure to the internal user; do not emit an
  unsourced or fabricated answer in its place.

## Privacy
- **Internal-only (BR-8):** Ask is reachable only by authenticated internal users, and must **never**
  return an answer drawn from internal-only artifacts to a non-internal user. Internal-only artifacts
  are **not exposed** to non-internal users (AC3, `EV-INTERNAL-LEAK`).
- The internal/public boundary is enforced at the data/retrieval layer (RLS), not just the UI.

## Open questions
- **Cost and rate considerations** of per-question Claude API calls (token/usage budget, rate limits,
  caching of retrieval/responses).
- How citations are **selected and ranked**, and the exact wording of the "not found" response
  (→ Product + Anthony).
- Model/version selection and any context-window limits on retrieved content.

## Sources
See frontmatter. Pinned to Decision 0005 (gt-07-0005-explorer-internal-claude-chat) and the
acceptance criteria in gt-03-us-explorer-ask.
