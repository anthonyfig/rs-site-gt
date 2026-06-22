---
id: gt-07-0002-stack
title: "0002 — Stack: Astro (marketing) + React 19/Vite/Supabase (Explorer)"
part: "07-decision-log"
type: decision
owner: "Platform Architect (suggested) + Anthony"
status: in-review
confidence: medium
sources:
  - "User-confirmed direction (Jun 2026): 'refine it; think about SEO and LLM discovery'"
  - "Proposed stack: React 18, Vite, Tailwind, shadcn/Radix, TanStack Query, Supabase"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-04-stack-and-architecture", "gt-04-seo-and-llm-discovery"]
tags: ["adr", "stack"]
---

# 0002 — Stack decision

**Status:** Accepted, pending Platform Architect validation · **Date:** 2026-06-22

## Context
The proposed stack was React 18 + Vite + Tailwind + shadcn/Radix + TanStack Query + Supabase for
everything. The site must be excellent at **SEO and LLM discovery** (explicit requirement). A pure
client-rendered React SPA hurts both (content isn't in server HTML — the exact failure of today's
homepage).

## Decision
- **Marketing site → Astro** (SSG/SSR, ~zero JS, React islands for interactivity).
- **Ground Truth Explorer → React 19 + Vite + Tailwind + shadcn/Radix + TanStack Query + Supabase.**
- **React 19**, not 18. **Monorepo** (pnpm + Turborepo) with a shared typed Ground Truth package
  and UI kit. Details in `04/stack-and-architecture.md`.

## Alternatives considered
- *Keep React 18 + Vite for everything.* Rejected for the marketing surface (SEO/LLM cost).
- *Single Next.js app for both.* Viable fallback if the team wants one framework; we prefer
  Astro+Vite to keep the content site JS-light and the app DX fast.
- *Keep Webflow for marketing, build only the Explorer.* Possible interim (see OQ-3); doesn't
  fully deliver the "site built by the method" proof.

## Consequences / tradeoffs
- Two frameworks to learn/operate (mitigated by shared packages and one component kit).
- Best-in-class SEO + LLM discovery and a clean app surface.
- Revisit if the team strongly prefers single-framework simplicity → switch to Next.js.
