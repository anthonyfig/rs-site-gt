---
id: gt-04-index
title: "Engineering Context — Index"
part: "04-engineering-context"
type: engineering-context
owner: "Platform Architect (suggested) + Anthony"
status: draft
confidence: medium
sources:
  - "User-confirmed stack direction (Jun 2026): 'refine it; think about SEO and LLM discovery'"
  - "Delivery v2 deck — AI Delivery System (Jun 2026)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-04-stack-and-architecture", "gt-04-seo-and-llm-discovery", "gt-07-0002-stack"]
tags: ["index", "engineering"]
---

# 04 · Engineering Context

How the software is built so that agents and engineers share one set of conventions. Authoritative
for stack, architecture, conventions, security, and deployment. Operating rules live in the
repo-root [`CLAUDE.md`](../../CLAUDE.md); this is the detail.

## Artifacts
| Artifact | Defines |
|----------|---------|
| [Stack & Architecture](stack-and-architecture.md) | The refined stack, two-surface architecture, monorepo, how Ground Truth becomes data |
| [SEO & LLM Discovery](seo-and-llm-discovery.md) | Search + generative-engine discoverability strategy and rules |
| [Design System](design-system.md) | Brand tokens, type, components & assets — the quality bar generated UI must meet |

## Principles
- **Derive from Ground Truth.** Content and structure come from `ground-truth/`, not hard-coded copy.
- **Right tool per surface.** Content/SEO surface ≠ interactive app; don't force one framework to do both.
- **Strict TypeScript, small components, no speculative abstraction** (per global guidelines).
- **Evals + a11y + Core Web Vitals are acceptance criteria**, enforced in the delivery loop (Part 06).
