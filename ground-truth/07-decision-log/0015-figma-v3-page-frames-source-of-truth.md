---
id: gt-07-0015-figma-v3-page-frames-source-of-truth
title: "0015 — Figma V3 page frames = design source of truth (gold; no pink gradient)"
part: "07-decision-log"
type: decision
owner: "Anthony"
status: approved
confidence: high
sources:
  - "Figma 'RS Website 2026 - V3' (file YWgx5Y3TkXGAMcrPcfGqHp) — per-page Dev Mode frames shared Jun 2026"
  - "User direction (Jun 2026): implement these designs; keep gold; drop the yellow→pink gradient; case-study content from Marketing Assets"
updated: 2026-06-23
last_validated: "2026-06-23"
validated_by: "Anthony"
applies_to: ["marketing-site"]
related: ["gt-07-0014-design-system-2026-v3", "gt-07-0013-marketing-content-in-sanity", "gt-04-design-system"]
tags: ["adr", "design", "figma", "pages"]
---

# 0015 — Figma V3 page frames = design source of truth (gold; no pink gradient)

**Status:** Approved — Anthony · **Date:** 2026-06-23

## Decision
The **Figma "RS Website 2026 — V3" page frames are the source of truth for page layout/structure.**
Implement them in Astro (via the Figma Dev Mode MCP `get_design_context`):

| Page | Figma node |
|------|------------|
| Home | `4607-5281` |
| About | `4843-10616` |
| Portfolio (Work) | `4843-10614` |
| Services | `4634-9572` |
| Capabilities | `4607-5282` |
| AI Landing | `10031-25134` |

## Constraints (override the raw Figma)
- **Palette stays gold** (Decision 0014). The frames include a **gold→pink gradient — NOT used.**
  Replace it with flat gold or a subtle low-opacity gold glow. **No pink** anywhere.
- **Case-study content + media come from Marketing Assets → Sanity** (Decision 0013), **not** Figma's
  placeholder case content/media.

## Consequences
- Pages (Home, About, Services, Capabilities, AI Landing, Portfolio) are rebuilt to match the frames,
  on our token system; Portfolio/Home pull case studies from Sanity.
- Figma assets (illustrations/icons) may be exported and placed under `public/figma/<page>/`.
- The "RS website Issues" doc is addressed: missing capabilities (Web, Mobile, UX/UI) are added; one
  consistent gold; single footer/header (Base layout).
