---
id: gt-04-stack-and-architecture
title: "Stack & Architecture"
part: "04-engineering-context"
type: engineering-context
owner: "Platform Architect (suggested) + Anthony"
status: draft
confidence: medium
sources:
  - "User-confirmed direction (Jun 2026): refine proposed stack; optimize for SEO + LLM discovery"
  - "Proposed stack: React 18, Vite, Tailwind, shadcn/Radix, TanStack Query, Supabase"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-04-seo-and-llm-discovery", "gt-07-0002-stack", "gt-07-0004-marketing-plus-explorer"]
tags: ["stack", "architecture", "recommendation"]
---

# Stack & Architecture

## Recommendation in one line
Keep your stack for the **app**, add the right tool for the **content site**:
**Astro** (marketing) + **React 19 + Vite + Tailwind + shadcn/Radix + TanStack Query + Supabase**
(Explorer), in one **monorepo** sharing a typed Ground Truth package and a shared UI kit.

> **Confirmed (Decision 0006, Jun 2026): Astro on Vercel** for the marketing site (Vercel = host,
> not framework). The Explorer is internal-only and its "chat with Ground Truth" runs on the
> **Anthropic (Claude) API** (Decision 0005).

## Two surfaces, two optimal tools

| | Public marketing site | Ground Truth Explorer |
|---|---|---|
| **Job** | Persuade + convert + be discoverable | Query/Browse/Trace/Validate/Generate over Ground Truth |
| **Traffic** | Anonymous, SEO/LLM-driven | Returning, possibly gated (OQ-2) |
| **Rendering** | Static/SSR, ship ~no JS | Client app, rich interactivity |
| **Tool** | **Astro** (+ React islands where needed) | **React 19 + Vite** SPA/islands |

### Why adjust from the proposed "React 18 + Vite for everything"
- **React 19, not 18.** It's mid-2026; React 19 is the stable default (Actions, `use`, improved
  Suspense/forms). No reason to greenfield on 18.
- **A plain Vite React SPA is the wrong tool for the *marketing* site.** It renders content in
  JS, which is exactly why this site's own homepage returned empty/placeholder HTML to a
  non-JS fetch — and LLM crawlers behave like that fetch. SEO + LLM discovery need
  **content in server-rendered HTML.** Astro delivers that with near-zero JS, top Core Web
  Vitals, MD/MDX content, and **React islands** so we still use shadcn/Radix where interactive.
- **Everything else you proposed stays:** TypeScript, Tailwind, shadcn/ui (Radix), TanStack
  Query, Supabase — all ideal for the Explorer.

> Alternative considered: a single **Next.js** app for both (your option 3). Viable and simpler
> to operate as one framework; we recommend Astro + Vite-React instead because the marketing site
> is content-first (Astro is purpose-built for that and ships less JS) and the Explorer is
> app-first (Vite/React is a faster DX than Next for a pure SPA). If the team prefers one
> framework, Next.js App Router is the fallback. Logged as Decision `0002`.

## Monorepo layout (proposed)
```
apps/
  marketing/      # Astro — public site, SSG/SSR, SEO + LLM discovery
  explorer/       # React 19 + Vite — the Ground Truth Explorer
packages/
  ground-truth/   # parses ground-truth/*.md(frontmatter) → typed Business Twin graph
  ui/             # shared shadcn/Radix + Tailwind components, design tokens
  content/        # MDX/insights, schema.org helpers
ground-truth/     # the GT package (this repo's 01–07) — the source of truth
```
Tooling: **pnpm workspaces + Turborepo**, TypeScript strict, ESLint/Prettier, Vitest (unit),
Playwright (e2e + behaviour evals → Part 06).

## Format & storage — Git is the system of record, the database is the engine (Decisions 0009/0010)
**The canonical artifact is always an agent-friendly markdown file with frontmatter, in a folder —
and Git is its system of record.** Media (images/video/docs) lives in **object storage** (Supabase
Storage), referenced from the markdown. The **database (Postgres + pgvector) is the engine, not the
source of truth** — it powers the Explorer's search, graph, chat, and RLS, and is **rebuilt/synced
from Git** on every change. The **Explorer is a Git-backed UI**: business users edit/upload/validate
through a friendly interface and, on approve, the Explorer authors a **clean commit on their behalf**
(they never see Git) — that commit is the validation history + human gate. No developer hand-commits;
no per-edit commits exposed to anyone. **Write path:** Explorer → Git → CI rebuilds the DB. **Read path:** DB.

## How Ground Truth becomes software
1. `packages/ground-truth` parses the frontmatter+markdown into a typed graph (artifacts =
   nodes, `related` = edges, metadata travels with each node). This *is* the Business Twin.
2. **Astro** consumes it at build time → fast static pages; selectively SSR for freshness.
3. **Explorer** consumes it via **Supabase**:
   - **Postgres** — artifacts, `validations` (review queue), leads-mirror.
   - **pgvector** — embeddings for **Ask** (semantic Q&A / RAG over Ground Truth).
   - **Auth** — gating if Explorer is private (OQ-2).
   - **Edge Functions** — the **Generate** actions (spec/eval/agent-task generation).
   - **RLS** — enforce **BR-8** (internal-only artifacts never served publicly).

## Security & deployment (initial)
- Secrets in env/manager, never in repo. RLS-first data access. Public vs internal enforced at
  the data layer, not just the UI.
- Hosting: static/edge (Vercel / Netlify / Cloudflare Pages). 301-map any changed URLs (SEO).
- Marketing-CMS decision (keep Webflow "RS2.0 - MASTER" vs migrate to Astro) is **OQ-3** — until
  resolved, treat content as Ground-Truth-sourced regardless of where it's hosted.
