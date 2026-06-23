---
id: gt-02-index
title: "Domain Model — Index"
part: "02-domain-model"
type: domain-entity
owner: "Head of Marketing + Product Architect (suggested)"
status: draft
confidence: medium
sources:
  - "rootstrapedia wiki (services, clients, industries, processes) — Apr 2026"
  - "Delivery v2 deck — /sources/ai-native-delivery.html (Jun 2026)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-02-vocabulary", "gt-02-entities", "gt-02-business-rules"]
tags: ["index", "domain"]
---

# 02 · Domain Model

The shared language and structure of Rootstrap-as-a-business, modeled precisely enough that the
website (and the Explorer over it) can be *derived* from it. This is what the Explorer's *Browse*
and *Graph* views render.

## Artifacts
| Artifact | What it defines |
|----------|-----------------|
| [Vocabulary](vocabulary.md) | The new terms (Ground Truth, Capability, Eval, Loop…) + the **old→new mapping** + dead terms |
| [Entities](entities.md) | The nouns: Service/Offering, Capability, Case Study, Client, Industry, Persona, Engagement Model, Lead, Insight, Proof Point |
| [Business Rules](business-rules.md) | The rules and guardrails that constrain how the business (and the site) behaves |
| [Content Types](content-types.md) | The **content** capabilities operate on — Page, Collection, Industry, Case Study, Insight/Post, Service/Offering (Decision 0012; not capabilities) |
| [AI Delivery Method](delivery-method.md) | Rootstrap's agentic method — the Agency Ladder, Prompt-First, the CC/CD loop, evals & the AI Discovery Sprint (the differentiator) |
| [Voice & Messaging](voice-and-messaging.md) | How the brand sounds + approved copy and claims — what page copy is derived from (verbal sibling of the design system) |
| [Values & Culture](values-and-culture.md) | Who Rootstrap is — the five core values, operating principles, and culture that About + Careers render |

## Modeling note
We deliberately model **two layers** that the site must hold simultaneously:
1. **Today's business** — services, clients, industries, proof (the credibility we already have).
2. **The new operating model** — Ground Truth, capabilities, loops, evals (the story we're now telling).
The site's job is to carry visitors from (1) to (2) without losing either.
