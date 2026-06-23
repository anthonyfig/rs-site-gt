---
id: gt-01-audience-and-icp
title: "Audience & ICP"
part: "01-project-context"
type: project-context
owner: "Head of Sales (suggested) + Head of Marketing"
status: draft
confidence: high
sources:
  - "Notion: Rootstrap ICP & Buyer Persona Report (May 2026) — most recent ICP source"
  - "rootstrapedia: wiki/marketing/icp-buyer-personas.md (Apr 2026)"
  - "live: https://www.rootstrap.com/ai-landing (fetched 2026-06-22)"
updated: 2026-06-23
last_validated: "pending"
validated_by: "pending"
review_cadence: "quarterly"
applies_to: ["marketing-site", "explorer"]
related: ["gt-02-entities", "gt-01-goals-and-scope"]
tags: ["icp", "personas", "audience"]
---

# Audience & ICP

> Confidence is **high**: the May-2026 ICP Report and the Apr-2026 wiki agree, and the live
> `/ai-landing` page already speaks to the AI-buyer overlay below.

## Keeping the ICP current (review cadence)
The ICP is expected to evolve — this artifact is the **single source of truth** the site, the
Explorer, and the `ask.mjs` agent all read from.

- **Owner:** Head of Sales + Head of Marketing. **Cadence:** reviewed **quarterly**, or whenever the
  Notion *ICP & Buyer Persona Report* changes (`review_cadence: quarterly` in the metadata).
- **To update:** edit this file (personas, anti-ICP, verticals, narrative) → bump `updated` and set
  `last_validated` + `validated_by` → commit. The change flows to the site on the next build and
  **immediately** to the Explorer / `ask.mjs` (Git-backed).
- **Staleness signal:** if the source report has changed but this file hasn't caught up, set
  `status: needs-revalidation` — the checker surfaces it so the ICP never drifts silently.

## The core insight (ICP Report, May 2026)
Rootstrap wins on **trajectory, not industry**: best engagements are *Scaling Tech Companies
needing elasticity* or *Funded Visionaries needing end-to-end product leadership*. It loses when
the relationship turns transactional or the executive champion is lost.

## Three buyer personas

### A — The Scaling Tech Executive  *(primary)*
- **Role:** CTO, VP Engineering, CPO. Modeled on MasterClass, The Farmer's Dog, Brightwheel.
- **Situation:** has a team, can't hire fast enough for the roadmap/board demands.
- **Core need:** capacity & elasticity, at internal-quality bar.
- **AI overlay (new):** under pressure to ship AI in production; has seen pilots stall.
- **Hook:** "Scale instantly, at your quality bar — and get AI that actually reaches production."

### B — The Mission-Driven Innovator
- **Role:** Director of Digital Innovation / Product Lead / Head of Transformation. Modeled on
  Special Olympics, NGOs.
- **Situation:** high-stakes public launch; lacks specific internal tech/AI expertise.
- **Core need:** reliability & capability; a partner to *own* execution risk.
- **Hook:** "Specialized expertise to make a high-stakes launch flawless."

### C — The Non-Technical Visionary
- **Role:** Founder / CEO / domain expert. Modeled on Door Space (primary), R&G Brenner.
- **Situation:** deep industry knowledge + funding + vision, no engineering culture.
- **Core need:** end-to-end product team ("help me define *what* to build").
- **Guardrail:** **verify liquidity / runway** — high pause-risk if funding dries up.

## The AI-native buyer (the wedge the new site leads with)
`/ai-landing` targets the buyer burned by the statistic that **"95% of enterprise AI pilots
never reach production."** Their problem is framed as integration / testing / production /
people — not models. Verticals already named: **Healthcare & Wellness, SaaS & Enterprise,
Financial Services & Legal, Healthtech.** This is the emotional entry point for Persona A and B.

## Anti-ICP (disqualify / handle with care)
- Transactional, lowest-cost-wins buyers (commodity offshoring).
- No internal champion / champion-loss risk (e.g., the Eruditus pattern).
- Zero failure tolerance with no "gold-standard" data (per AI Delivery Playbook: scope down to
  L1 or decline).

## Implications for the site
- Lead with **outcome + mechanism** (AI in production, the method), not a services list or "cheaper."
- Speak Persona A first; give Persona C an "I have a vision, not a team" path.
- Proof must be ICP-shaped — lead with the confirmed six (OQ-5): MasterClass · The Farmer's Dog · Madison Reed · Emeritus · BetterUp · Door Space.

## Authoritative AI narrative (Rootstrap Overview, June 2026)
The official June-2026 overview is the most current external-ready framing — the site should
build on it (and it aligns with the Delivery v2 thesis):
- **"AI isn't failing at the model level — it's failing at the product level."** Most orgs can
  demo; they stall in production: reliability, integration, evaluation, and edge cases.
- **Structure before scale:** the **AI Discovery Sprint (2–6 weeks)** defines data readiness,
  architecture, evaluation, and key risks → a clear, actionable plan *before* development
  investment ("clarity before commitment"). AI is treated as **a core part of the product, not
  an add-on** — with built-in evaluation, observability, and controls.
- **What clients usually ask** (use as on-site FAQ / objection-handling — and as ideal
  LLM-discovery Q&A, per `04/seo-and-llm-discovery`):
  1. *Will we be locked in?* → "You own the code, infrastructure, and data. We build in your environment from day one."
  2. *Do you actually use AI internally?* → "Yes — across development, testing, and delivery, with full engineering review and QA." (Tooling named: **Claude Code**, **UIPilot**.)
  3. *Will AI reduce costs?* → "AI reduces coding time but increases the importance of architecture, evaluation, and reliability. We use it to deliver more value, not lower-quality output."
- **Dogfooding proof:** Rootstrap already builds *with* AI (senior engineers review/validate all
  outputs). This is the credibility base the Ground Truth story extends — and exactly what this
  website pilot demonstrates.
