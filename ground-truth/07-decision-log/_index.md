---
id: gt-07-index
title: "Decision Log — Index"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor)"
status: approved
confidence: high
sources: ["This project's working sessions, Jun 2026"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["marketing-site", "explorer", "ground-truth"]
related: []
tags: ["index", "decisions", "adr"]
---

# 07 · Decision Log

Material decisions, with rationale, alternatives, and consequences (ADR style). These are the
decisions an agent must respect and a future reader must be able to reconstruct. New decisions get
the next number and never get rewritten — they get superseded.

| # | Decision | Status | Date |
|---|----------|--------|------|
| [0001](0001-adopt-ground-truth-blueprint.md) | Adopt the Ground Truth Blueprint as the operating model; this site is the pilot | Accepted | 2026-06-22 |
| [0002](0002-stack-astro-react19-supabase.md) | Stack: Astro (marketing) + React 19/Vite/Tailwind/shadcn/TanStack/Supabase (Explorer), monorepo | Accepted (pending validation) | 2026-06-22 |
| [0003](0003-reconcile-fixed-bid-vs-never-fixed-price.md) | Fixed-bid reconciliation is **out of scope** (internal project; deferred to company GTM) | Accepted | 2026-06-22 |
| [0004](0004-marketing-site-plus-explorer.md) | Build two surfaces: public marketing site + Ground Truth Explorer | Accepted | 2026-06-22 |
| [0005](0005-explorer-internal-claude-chat.md) | Explorer is internal-only, with Claude-powered chat over Ground Truth | Accepted | 2026-06-22 |
| [0006](0006-exit-webflow-astro-vercel.md) | Exit Webflow; rebuild marketing site on **Astro + Vercel** | Accepted | 2026-06-22 |
| [0007](0007-capability-specs-and-user-stories.md) | Capability specs (human) + user stories (agent) as first-class artifacts | Accepted | 2026-06-22 |
| [0008](0008-ground-truth-database-backed-and-media.md) | Media + intelligent ingest first-class _(system-of-record refined by 0010)_ | Accepted | 2026-06-22 |
| [0009](0009-format-files-canonical-db-engine.md) | Format: agent-friendly files are canonical _(sharpened by 0010)_ | Accepted | 2026-06-22 |
| [0010](0010-git-system-of-record-db-engine.md) | **Git is the system of record; the DB is the engine; the Explorer is a Git-backed UI** | Accepted | 2026-06-22 |
| [0011](0011-separate-repos-ground-truth-vs-website.md) | Separate repos (not submodules): **rs-site-gt** (content) · **rs-ip** (method) · **rs-site** (code) | Accepted | 2026-06-22 |
| [0012](0012-capability-vs-content-definition.md) | **A capability is a function, not a page; add the Content layer** | Accepted | 2026-06-22 |
| [0013](0013-marketing-content-in-sanity.md) | **Marketing content moves to Sanity (headless CMS)**; Astro builds from it; Webflow retired _(refines 0010, confirms 0006)_ | Approved | 2026-06-23 |
| [0014](0014-design-system-2026-v3.md) | **Keep the gold primary** — Figma V3 lime/pink evaluated, not adopted (gold `#FFC83F` stays) | Approved | 2026-06-23 |
| [0015](0015-figma-v3-page-frames-source-of-truth.md) | **Figma V3 page frames = design source of truth** (Home/About/Portfolio/Services/Capabilities/AI); gold, no pink gradient | Approved | 2026-06-23 |
| [0016](0016-explorer-edits-ground-truth-vercel.md) | **Explorer edits the Ground Truth** (tone, ICP) behind a human gate; **deploys to Vercel** | Approved | 2026-06-23 |
| [0017](0017-explorer-chat-backend-supabase-vercel.md) | **Explorer chat backend**: Vercel function + Anthropic API + Supabase auth; pgvector deferred | In review | 2026-06-24 |
