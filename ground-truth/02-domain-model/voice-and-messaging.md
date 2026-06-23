---
id: gt-02-voice-and-messaging
title: "Voice & Messaging"
part: "02-domain-model"
type: domain-concept
owner: "Head of Marketing (suggested)"
status: draft
confidence: medium
sources:
  - "Webflow [V3] copy: What We Deliver, Why Rootstrap, Safety/Observability/Compliance (Jun 2026)"
  - "Rootstrap Overview — June 2026 (positioning + 'what clients ask')"
  - "sources/ai-native-delivery.html (Delivery v2 — editorial north star)"
  - "rootstrapedia: wiki/marketing/elevator-pitch.md, value-propositions.md (Apr 2026)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-02-vocabulary", "gt-01-audience-and-icp", "gt-02-delivery-method", "gt-04-design-system", "gt-02-business-rules"]
tags: ["voice", "tone", "messaging", "copy", "brand"]
---

# Voice & Messaging

> The home for **how Rootstrap sounds** and the **approved copy** every page draws from. The verbal
> counterpart of the visual `design-system` (Part 04). Page copy is *content*, but its rules,
> messages, and canonical phrasings live here. Claims must obey the business rules (BR-7/8/12/13).

## Voice principles
- **Production over hype.** We sound like senior engineers, not a hype reel. Evidence beats adjectives.
  Avoid "revolutionary", "cutting-edge", "next-gen", "unleash", "supercharge".
- **Precise and concrete.** Name the mechanism — evals, guardrails, loops, observability, RAG — not
  vague "AI magic". Prefer specifics and numbers (verified ones) to claims.
- **Outcome-first.** Lead with the business outcome, then the method. "AI that reaches production",
  not "we use LLMs".
- **Calm authority.** Confident, plain, a little contrarian where earned ("AI isn't failing at the
  model level — it's failing at the product level"). Short sentences. Active voice. "We".
- **Honest about hard things.** Reliability, compliance, and risk are features we talk about, not
  things we hide. We don't overpromise cost savings or timelines.

## Tone by context
- **Marketing pages** — bold, clear, benefit-led; one strong idea per section.
- **AI / regulated copy** — reassuring and exact; emphasize evaluation, audit trails, human review.
- **Insights / blog** — substantive and teachable (this is the LLM-discovery engine; be the source worth citing).
- **Forms / microcopy** — direct and low-friction; tell people what happens next.

## Key messages (the spine)
1. **"AI isn't failing at the model level. It's failing at the product level."** The hard part is
   integration, data, evaluation, reliability, adoption.
2. **Clarity before commitment / structure before scale.** The AI Discovery Sprint de-risks before the build.
3. **Production-grade AI, not demos.** We ship AI inside real products.
4. **Senior, nearshore, embedded.** Senior engineers in US-aligned time zones, working inside your roadmap.
5. **The AI layer your enterprise clients will actually sign off on.** Safety, observability, compliance.
6. **We dogfood the method.** Ground Truth → specs → agents + loops → working software, with human review.

## Approved phrasings & claim guardrails
- **Always:** "SOC 2 certified" · "Anthropic-certified teams" · "agentic delivery with evals,
  guardrails & observability".
- **Never:** "Anthropic partner" / "Anthropic partnership" (in progress, not finalized — **BR-12**).
- **Proof points (verify before use — BR-7):** 750+ products launched · 180+ senior team · 14+ years ·
  5 startups grown to $1B+ · millions of users · 4 hubs (Montevideo · Buenos Aires · Medellín · Los Angeles).
  *(Note: the live site/`llms.txt` still say 200+/10+ unicorns — reconcile per OQ-9 before mixing sources.)*
- **Never publish internal-only data (BR-8):** client revenue, deal sizes, client tiers, the anti-ICP list.
- **Regulated trust (BR-13):** "compliance-aware engineering, not legal advice."

## Do / Don't
| Do | Don't |
|----|-------|
| "AI that reaches production" | "Harness the power of AI" |
| "We curate behaviors, not just build features" | "Cutting-edge GenAI solutions" |
| "Evals, guardrails, and human review" | "Fully autonomous, no oversight needed" |
| "5 startups grown to $1B+" (verified) | invented or unverifiable metrics |
| "Anthropic-certified teams" | "Anthropic partner" |

## Canonical copy (reuse these)
- **One-liner:** "Rootstrap turns AI ambition into production systems — agentic AI, RAG, evaluation
  and observability, built into real products by senior nearshore teams."
- **Primary CTA:** "Start an AI Discovery Sprint" → `/contact`. Secondary: "See our work" → `/work`.
- **What clients ask (objection-handling Q&A — also ideal for LLM discovery):**
  1. *Will we be locked in?* "You own the code, infrastructure, and data. We build in your environment from day one."
  2. *Do you actually use AI internally?* "Yes — across development, testing, and delivery, with full engineering review and QA."
  3. *Will AI reduce costs?* "AI reduces coding time but raises the importance of architecture, evaluation, and reliability. We use it to deliver more value, not lower-quality output."
- **Discovery Sprint promise:** "2–6 weeks: data-readiness map, architecture recommendation, evaluation framework, and a risk register — a clear plan before any build."

## Where copy lives
Voice + messages + approved snippets: **here**. Controlled terms: `vocabulary.md`. The method language:
`delivery-method.md`. Visual brand: `04/design-system.md`. Page copy is **content** (rendered by the
Content-Publishing capability), authored against this artifact. Conflicts on claims route to the
business rules and OQ-9 (stats).
