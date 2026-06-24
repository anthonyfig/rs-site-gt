---
id: gt-07-0017-explorer-chat-backend-supabase-vercel
title: "0017 — Explorer chat backend: Vercel function + Anthropic API + Supabase auth; pgvector deferred"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: in-review
confidence: medium
sources:
  - "User direction (Jun 2026): add a chat bubble to the Explorer with a real backend; 'go to Supabase or whatever is needed — choose the best architecture'"
  - "Refines Decision 0005 (internal-only Claude chat) and 0016 (Explorer deploys to Vercel)"
  - "Reference impl (Jun 2026): rs-site-gt/api/ask.mjs + tools/ground-truth/retrieval.mjs, verified live (claude-sonnet-4-6)"
updated: 2026-06-24
last_validated: "pending"
validated_by: "pending"
applies_to: ["explorer", "ground-truth"]
related: ["gt-07-0005-explorer-internal-claude-chat", "gt-07-0016-explorer-edits-ground-truth-vercel", "gt-07-0010-git-system-of-record-db-engine", "gt-07-0002-stack", "gt-03-capability-explorer", "gt-03-us-explorer-ask", "gt-05-anthropic-api"]
tags: ["adr", "explorer", "chat", "auth", "vercel", "supabase"]
---

# 0017 — Explorer chat backend (Vercel + Anthropic + Supabase auth); pgvector deferred

**Status:** In review — proposed by the build agent, awaiting Anthony · **Date:** 2026-06-24

## Decision
The Explorer's **"Ask the Ground Truth"** chat is served by a **Vercel serverless function**
(`/api/ask`) that (1) verifies the caller is internal, (2) retrieves the most relevant Ground Truth
artifacts from a **Git-rebuilt index**, (3) answers via the **Anthropic (Claude) API** with the key
**server-side only**, and (4) returns the answer with **citations that resolve to real artifacts**.

- **Hosting:** the Explorer and the function deploy together on **Vercel** (Decision 0016). The
  function is Node; secrets (`ANTHROPIC_API_KEY`, Supabase service values) live only in Vercel env.
- **Auth / internal-only:** **Vercel Deployment Protection** gates the served HTML (which embeds GT
  content). **Supabase Auth** (magic link, restricted to the Rootstrap email domain) identifies the
  user, and `/api/ask` validates that session JWT — defense in depth for Decision 0005's
  internal-only rule and US `gt-03-us-explorer-ask` AC3.
- **Retrieval index:** the build emits `api/_gt-index.json` from the canonical Git Ground Truth on
  every deploy — this *is* "the index, rebuilt from Git" (Decision 0010). Ranking is shared keyword
  overlap (`tools/ground-truth/retrieval.mjs`), the same path the CLI `ask.mjs` uses.
- **pgvector + Supabase Postgres index are deferred.** For a ~60–80 artifact corpus, keyword
  retrieval is sufficient and verified; standing up a vector DB now would be speculative complexity.

## Why
- It makes the chat **real** (live, grounded, cited answers) with the **minimum** infrastructure
  that satisfies the approved specs — honoring "simplicity first" while staying on the chosen stack.
- It keeps **Git as the system of record** (Decision 0010): the index is derived, never authored.
- It keeps the Explorer **openable as a single local file** for demos — when no backend is reachable
  the chat degrades to in-browser retrieval with citations rather than failing.

## Alternatives considered
- **Supabase Edge Function (Deno) instead of a Vercel function** — viable, but the Explorer already
  targets Vercel (0016) and Node is easier to test in this repo. Auth still uses Supabase.
- **pgvector now** — rejected for this slice as overkill for the corpus size; revisit per the gate
  below. The mention of pgvector in Decisions 0005/0010 is **refined**, not contradicted: the
  engine is still "an index rebuilt from Git," just keyword-ranked for now.
- **Bring-your-own-key in the browser** — rejected; it cannot keep the key server-side.

## Consequences
- New surfaces in the repo: `api/ask.mjs`, `tools/ground-truth/retrieval.mjs`, `vercel.json`, a build
  step that emits `api/_gt-index.json` + `public/index.html`, and `docs/explorer-backend-runbook.md`.
- The Explorer gains a chat bubble (US `gt-03-us-explorer-ask`) and a Decisions workspace
  (US `gt-03-us-explorer-decisions`).
- Internal-only now has a concrete enforcement story (Vercel Protection + Supabase JWT) rather than
  an open question — though the **auth-provider details** remain a human gate (below).

## Open questions / human gates
- Final **auth provider** and how "internal user" vs "validator" rights are assigned (still open from
  0016 / the Explorer capability) → Anthony + Platform.
- The **trigger** to adopt pgvector (corpus size / answer quality) → Product + Platform.
- Whether to also persist a lightweight **ask log** (questions, cited artifacts) for evals → Product.
