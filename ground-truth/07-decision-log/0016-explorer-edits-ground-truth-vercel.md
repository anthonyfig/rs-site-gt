---
id: gt-07-0016-explorer-edits-ground-truth-vercel
title: "0016 — The Explorer edits the Ground Truth (tone, ICP) behind a human gate; deploys to Vercel"
part: "07-decision-log"
type: decision
owner: "Anthony + Product Architect (suggested)"
status: approved
confidence: high
sources:
  - "User direction (Jun 2026): update GT (tone of voice, ICP) from the Explorer; Explorer should go to Vercel"
  - "Refines Decision 0010 (Explorer commits to Git) and 0005 (internal-only Explorer)"
updated: 2026-06-23
last_validated: "2026-06-23"
validated_by: "Anthony"
applies_to: ["explorer", "ground-truth"]
related: ["gt-07-0010-git-system-of-record-db-engine", "gt-07-0005-explorer-internal-claude-chat", "gt-03-capability-explorer", "gt-01-audience-and-icp", "gt-02-voice-and-messaging"]
tags: ["adr", "explorer", "editing", "vercel", "icp", "tone"]
---

# 0016 — The Explorer edits the Ground Truth (tone, ICP) behind a human gate; deploys to Vercel

**Status:** Approved — Anthony · **Date:** 2026-06-23

## Decision
- The **Ground Truth Explorer is an editing surface**, not just read + ask. Authenticated internal
  users can **propose and edit artifacts through the UI — explicitly including tone of voice
  (`voice-and-messaging`) and the ICP (`audience-and-icp`)** — with changes **committed to Git behind
  a human gate** (refines Decision 0010: the Explorer writes; CI rebuilds the DB/index).
- The **Explorer deploys to Vercel** (alongside the marketing site), **internal-only / authenticated**
  (Decision 0005). Same host, separate app.

## Why
The GT must stay current with low friction — non-engineers should update positioning, tone, and ICP
without touching Git directly. Editing in the Explorer (with review + commit) keeps Git the system of
record while making updates easy and auditable.

## Consequences
- Explorer scope grows: **auth**, an **edit + review/approve UI**, and a **gated commit path** (PR or
  direct gated commit) to `rs-site-gt`. The Ask/Validate features already specced remain.
- Edits flip affected artifacts to `needs-revalidation` until re-approved (checker enforces).
- Deploy target = **Vercel** (build/host); secrets server-side (Anthropic key, repo token) per 0005.

## Open questions / human gates
- Commit mechanism (PR vs. gated direct commit) and who approves.
- Auth provider for internal users; mapping edit rights to artifact ownership.
