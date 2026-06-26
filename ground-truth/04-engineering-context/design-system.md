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
  - "Figma — RS Website 2026 V3 (file YWgx5Y3TkXGAMcrPcfGqHp): lime/pink explored, NOT adopted — gold retained (Decision 0014)"
updated: 2026-06-26
last_validated: "2026-06-26"
validated_by: "Anthony — gold retained; accent-swap-maps-every-element clarified (rs-site#122/#123)"
applies_to: ["marketing-site", "explorer"]
related: ["gt-04-stack-and-architecture", "gt-04-seo-and-llm-discovery", "gt-07-0014-design-system-2026-v3"]
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
- **No pink / no gradient:** the Figma V3 frames show a gold→pink gradient — **not used** (Decision 0015). Gold is the only accent; page *layouts* follow the Figma frames.
- **The accent swap maps EVERY element, not just the obvious ones.** Wherever a Figma frame draws an element in the rejected accent colours — the dark→purple→lime angular gradient, the gold→pink gradient, or the periwinkle illustration colour `#778FED` — that element is recoloured to flat gold `#FFC83F` in code. This applies to **all** affected elements, including **borders, dividers, rules, strokes, connectors, and glyphs** — not only fills or the element a task happens to name. **Never substitute a default neutral token** (e.g. `--rs-line` / `--rs-border`) for an element Figma draws in the accent. **Sibling decorative elements that Figma draws the same colour must be the same colour in code** (e.g. a connector arrow and its column divider — both accent → both gold). Verify per-element with `scripts/figma.mjs inspect <node>` (reports each node's `border:#hex`/stroke), not just the called-out element.
- Semantic tokens for both **light and dark** themes: `--rs-bg`, `--rs-bg-elevated`, `--rs-fg`, `--rs-fg-muted`, `--rs-border`, `--rs-link`.

**Type**
- **Display:** Poppins (`--rs-font-display`) · **Body:** Inter (`--rs-font-body`) · **Mono:** JetBrains Mono (`--rs-font-mono`).

**Motion**
- Durations `--rs-dur-fast 140ms` / `--rs-dur-base 240ms`; ease `cubic-bezier(0.22,1,0.36,1)`.

## Assets (`/design-system/assets/`)
- Logos: `logo-rootstrap-white.svg`, `logo-rootstrap-dark.svg`, `logo-rootstrap-mark.svg`
- `badge-clutch.svg` (Clutch top-rated)
- Brand shapes: `shape-waves`, `shape-sphere`, `shape-circles`, `shape-grid`

## Logos — never fake one (hard rule)

Never hand-draw, approximate, trace, or AI-generate a logo or brand mark — not Rootstrap's, not a
client's, not a partner/technology mark (e.g. AWS service icons, Azure, Google Cloud). **Always use
the real SVG asset:** the Rootstrap logos above, the marketing app's `public/brand/` (Rootstrap +
badges) and `public/brand/tech/` (technology/partner logos), or Sanity (client logos). If the real
asset is missing, **stop and ask for it** — do **not** improvise one in inline SVG or CSS. Recognized
third-party marks should come from an authoritative source (official brand kit, or curated sets like
devicon / gilbarbara-logos); simple-icons has dropped AWS/Azure marks for trademark reasons.

## How it's used
- The **marketing site** (Astro) and the **Explorer** both consume these tokens via the shared
  `packages/ui` (shadcn/Radix themed to the tokens). No ad-hoc colors/fonts.
- The Ground Truth Explorer v0 navigator is themed to these tokens (gold/periwinkle/near-black, Poppins/Inter/JetBrains); rebuild after a token change.
- Accessibility (WCAG/POUR) and Core Web Vitals are acceptance criteria; the design system must be applied without regressing them.

> Light + dark are both first-class. Components, spacing, and elevation in the standalone
> reference are the source for `packages/ui`.
