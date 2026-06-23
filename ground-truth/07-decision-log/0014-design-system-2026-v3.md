---
id: gt-07-0014-design-system-2026-v3
title: "0014 — Keep the gold primary (Figma V3 lime evaluated, not adopted)"
part: "07-decision-log"
type: decision
owner: "Anthony"
status: approved
confidence: high
sources:
  - "Figma 'RS Website 2026 - V3' (file YWgx5Y3TkXGAMcrPcfGqHp) — variables show a lime primary + pink accent"
  - "User decision (Jun 2026): 'gold is the right color' — do not change gold to lime"
updated: 2026-06-23
last_validated: "2026-06-23"
validated_by: "Anthony"
applies_to: ["marketing-site", "explorer"]
related: ["gt-04-design-system"]
tags: ["adr", "design", "brand", "tokens", "figma"]
---

# 0014 — Keep the gold primary (Figma V3 lime evaluated, not adopted)

**Status:** Approved — Anthony · **Date:** 2026-06-23

## Context
The Figma file "RS Website 2026 — V3" exposes design variables with a **lime-yellow primary**
(`#F6FF7A`) + **pink** accent (`#FF99CA`) on the existing dark canvas. We pulled those variables and
briefly trialled them in `tokens.css`.

## Decision
**Keep gold `#FFC83F` as the primary brand color.** Anthony confirmed gold is correct; the Figma V3
lime/pink is **not** adopted. The lime trial was reverted the same day (tokens, nav divider, and the
`.cta-band` gradients restored to gold). Periwinkle `#778FED` secondary unchanged.

## Why record it
So we don't "rediscover" the Figma V3 lime and re-propose it. Figma stays useful for **layout parity
and asset export** (via `get_design_context`), but the **palette stays gold** per brand.

## Consequences
- `design-system.md` continues to list **gold** as the primary (authoritative).
- Figma is used for structure/assets, not color.
