---
id: gt-04-design-system
title: "Design System"
part: "04-engineering-context"
type: engineering-context
owner: "Design lead (suggested)"
status: approved
confidence: high
sources:
  - "Rootstrap Design System (provided Jun 2026) — /design-system/ (standalone reference + assets)"
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Provided as the current design system"
applies_to: ["marketing-site", "explorer"]
related: ["gt-04-stack-and-architecture", "gt-04-seo-and-llm-discovery"]
tags: ["design", "brand", "tokens", "standards"]
---

# Design System

The brand's design standards — the **quality bar agents and engineers generate against** (the
"design standards" pillar of the AI Delivery System). The full reference + assets live in
[`/design-system/`](../../design-system/) (standalone HTML, `support.js`, and `assets/`).

## Tokens (authoritative)

**Color**
- **Primary — gold:** `#FFC83F` (`--rs-primary-500`), scale 100→900. The signature Rootstrap accent; used for links/CTAs.
- **Secondary — periwinkle:** `#778FED` (`--rs-secondary-500`).
- **Neutrals:** `#F5F5F5` (100) → `#191A1B` (900, near-black). Dark surface = neutral-900; light surface = white.
- Semantic tokens for both **light and dark** themes: `--rs-bg`, `--rs-bg-elevated`, `--rs-fg`, `--rs-fg-muted`, `--rs-border`, `--rs-link`.

**Type**
- **Display:** Poppins (`--rs-font-display`) · **Body:** Inter (`--rs-font-body`) · **Mono:** JetBrains Mono (`--rs-font-mono`).

**Motion**
- Durations `--rs-dur-fast 140ms` / `--rs-dur-base 240ms`; ease `cubic-bezier(0.22,1,0.36,1)`.

## Assets (`/design-system/assets/`)
- Logos: `logo-rootstrap-white.svg`, `logo-rootstrap-dark.svg`, `logo-rootstrap-mark.svg`
- `badge-clutch.svg` (Clutch top-rated)
- Brand shapes: `shape-waves`, `shape-sphere`, `shape-circles`, `shape-grid`

## How it's used
- The **marketing site** (Astro) and the **Explorer** both consume these tokens via the shared
  `packages/ui` (shadcn/Radix themed to the tokens). No ad-hoc colors/fonts.
- The Ground Truth Explorer v0 navigator is already themed to these tokens (gold/periwinkle/near-black, Poppins/Inter/JetBrains).
- Accessibility (WCAG/POUR) and Core Web Vitals are acceptance criteria; the design system must be applied without regressing them.

> Light + dark are both first-class. Components, spacing, and elevation in the standalone
> reference are the source for `packages/ui`.
