---
id: gt-03-index
title: "Capability Specs — Index"
part: "03-capability-specs"
type: capability-spec
owner: "Product Architect (suggested)"
status: draft
confidence: medium
sources: ["Delivery v2 deck (capability hierarchy) + project goals (Jun 2026)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-03-capability-lead-capture", "gt-01-goals-and-scope"]
tags: ["index", "capabilities"]
---

# 03 · Capability Specs

The website's own **capabilities** — each a unit of *value*, specified with actors, paths,
acceptance criteria, and evals. (Same shape we'd use for a client capability; this is the dogfood.)

## The website capability map
More than the current site, and more **dynamic**. Modeled on today's rootstrap.com IA
(capabilities, services, case studies, industries, insights, about, careers, contact) but rebuilt
around the agentic story and driven by **structured content** (Ground Truth / CMS), not hand-built
pages. Each is a unit of *value*; specs are written just-in-time and validated before they drive a
build (BR-1).

### Narrative & positioning
| Capability | Tier | Notes |
|---|---|---|
| [Home / positioning narrative](home-positioning/capability.md) | C2 | **Worked — capability + 3 user stories.** "agency" → AI-native partner; lead agentic |
| [How we work (the method)](how-we-work/capability.md) | C2 | **Worked — capability + 2 user stories.** Agents/loops/evals/guardrails/human gates; the dogfood |
| Trust & proof bar | C1 | Logos · 750+/180+/14 yrs · awards · **SOC 2** · **Anthropic-certified teams** (BR-12/13) |

### Offering (dynamic)
| Capability | Tier | Notes |
|---|---|---|
| [AI-native offering hub](ai-offering-hub/capability.md) | C2 | **Worked — capability + 3 user stories.** Discovery Sprint · Readiness · Product Dev · Integration |
| Capability-area detail pages | C2 | AI · Data · Cloud · Web · Mobile · Product & Design (June 2026 Overview taxonomy) |
| Delivery models | C1 | Full Product vs Staff Augmentation (kept secondary — OQ-4) |
| Industries (dynamic, filterable) | C2 | Healthcare, Fintech, SaaS, Healthtech… from structured content |

### Proof (dynamic)
| Capability | Tier | Notes |
|---|---|---|
| [Case-study showcase + detail](case-study-showcase/capability.md) | C2 | **Worked example — capability + 3 user stories.** Lead with the six (OQ-5); filterable; rich media + ingest; BR-7/8 |
| Insights / blog (index + article) | C2 | Thought leadership; structured for **LLM discovery** (`04/seo-and-llm-discovery`) |

### Company
| Capability | Tier | Notes |
|---|---|---|
| About (team · values · hubs · awards) | C1 | US·UY·AR·CO; recognition; the people story |
| Careers | C1 | Roles + culture |

### Conversion
| Capability | Tier | Notes |
|---|---|---|
| [Capture & qualify a lead → AI Discovery Sprint](capability-lead-capture.md) | C2 | **Worked exemplar.** HubSpot + **direct scheduling** + **Slack** (`05/hubspot`) |

### Platform & foundations
| Capability | Tier | Notes |
|---|---|---|
| **Ground Truth Explorer** (internal) | C4 | The proof / dogfood surface; chat with the model — [`/explorer/SPEC.md`](../../explorer/SPEC.md) |
| Global nav, search & IA | C1 | Information architecture in plain, non-technical language |
| SEO + LLM discovery + analytics | C2 | Server-rendered, schema.org, `llms.txt`, HubSpot/GTM (`04`, `05`) |
| Accessibility (WCAG) baseline | C1 | POUR; an acceptance criterion, not an afterthought |

> ~18 capabilities — a platform-sized scope (Delivery v2 says 15–20). **Five are now worked out as
> the pattern** — [lead capture](capability-lead-capture.md), [case-study showcase](case-study-showcase/capability.md),
> [home / positioning](home-positioning/capability.md), [how we work](how-we-work/capability.md), and the
> [AI-native offering hub](ai-offering-hub/capability.md) — each a capability spec + its user stories.
> The rest are written just-in-time and validated before they drive a build (BR-1).

## Capability spec vs user story (Decision 0007)
- A **capability spec** is *human-facing* — the unit of value stakeholders validate.
- Its **user stories** are *agent-facing* — executable units with Given/When/Then acceptance criteria
  that map to evals. Many stories per capability. See the case-study-showcase folder for the shape.
