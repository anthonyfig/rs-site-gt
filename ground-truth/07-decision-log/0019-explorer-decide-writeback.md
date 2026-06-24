---
id: gt-07-0019-explorer-decide-writeback
title: "0019 — Explorer decides: outcomes commit back to Git via /api/decide"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: approved
confidence: medium
sources:
  - "User direction (Jun 2026): the Decisions page must let me actually decide, see decisions assigned to me, badge pending ones, and use Claude to inform the decision"
  - "Refines Decision 0016 (Explorer edits the Ground Truth behind a human gate) and 0017 (chat backend); advances US gt-03-us-explorer-validate for decisions"
  - "Reference impl (Jun 2026): rs-site-gt/api/decide.mjs + the Decide panel in build-explorer.mjs"
updated: 2026-06-24
last_validated: "2026-06-24"
validated_by: "anthony@rootstrap.com"
applies_to: ["explorer", "ground-truth"]
related: ["gt-07-0016-explorer-edits-ground-truth-vercel", "gt-07-0017-explorer-chat-backend-supabase-vercel", "gt-07-0010-git-system-of-record-db-engine", "gt-03-us-explorer-decisions", "gt-03-us-explorer-validate"]
tags: ["adr", "explorer", "decisions", "write-back", "human-gate"]
---

# 0019 — Explorer decides: outcomes commit back to Git via /api/decide

**Status:** In review — proposed by the build agent, awaiting Anthony · **Date:** 2026-06-24

## Decision
The Decisions workspace becomes an **acting** surface, not just tracking + compose-to-export
(US-7's first slice). An authenticated internal user can **Approve / Request changes / Reject** a
decision, and the Explorer **writes the outcome back to the Git decision file** via a serverless
function `/api/decide`:

- **Recommendation, then decision.** For the selected decision the Explorer asks the **Anthropic
  API** (reusing `/api/ask`) for a recommendation **grounded only in the Ground Truth, with
  citations**; the user can ask follow-ups and capture the takeaway as their rationale.
- **Write-back (human gate).** On the explicit click, `/api/decide` updates the decision's
  frontmatter (`status` → `approved`/`deprecated`, `last_validated`, `validated_by` = the signed-in
  user, `updated`) and appends a **Decision outcome** note with the rationale, then commits via the
  **GitHub Contents API** (repo token server-side). Vercel rebuilds and the board reflects it.
- **Surfacing.** The board shows a **"Assigned to me"** filter (owner matched to the signed-in
  identity) and the menu shows a **badge** of the user's pending decisions.

This keeps **Git as the system of record** (Decision 0010): the Explorer authors a clean commit on
the user's behalf — it is the decision-flavored realization of US-5 (validate → clean commit).

## Why
- "Actually deciding" only means something if it persists and is auditable — and per Decision 0010
  that persistence belongs in Git, not a side database.
- Grounding the recommendation in the model (not free generation) keeps the AI honest and traceable,
  consistent with the Ask story's no-fabrication rule.

## Consequences
- New env for the deployment: **`GITHUB_TOKEN`** (fine-grained, repo **Contents: read/write**) and
  optional `GITHUB_REPO` / `GITHUB_BRANCH`. Without the token, `/api/decide` returns a clear
  "not configured" and the UI falls back to manual commit — nothing breaks.
- Outcomes are eventually-consistent with the UI (board updates after the ~1-min rebuild); the client
  updates optimistically in the meantime.
- The write path is **Explorer → GitHub API → Git**; no raw hand-commits are exposed (Decision 0010).

## Open questions / human gates
- Whether **"request changes"** should notify the owner / open an issue, vs. only annotating the file
  → Product + Anthony.
- Who may decide vs. only view (validator rights), still open from the Explorer capability and 0016.
- "Assigned to me" currently matches the **owner free-text** to the user's name/email; an explicit
  `assignee` field may be worth adding later.

## Decision outcome (2026-06-24)
- **Outcome:** Approved
- **By:** anthony@rootstrap.com
- **Rationale:** —
