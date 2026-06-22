---
id: gt-02-entities
title: "Entity Catalog"
part: "02-domain-model"
type: domain-entity
owner: "Head of Marketing + Product Architect"
status: draft
confidence: medium
sources:
  - "Rootstrap Overview — June 2026 (authoritative current overview) — /sources/Rootstrap-Overview-June-2026.pdf"
  - "rootstrapedia: wiki/services, wiki/clients, wiki/industries, wiki/processes (Apr 2026)"
  - "Notion: ICP & Buyer Persona Report (May 2026)"
  - "live: rootstrap.com nav + /ai-landing (fetched 2026-06-22)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-02-vocabulary", "gt-02-business-rules", "gt-05-index"]
tags: ["entities", "content-model"]
---

# Entity Catalog

The nouns the site is built from. Each lists key fields, the **source of truth**, and which site
surfaces consume it. (High-traffic entities can later split into their own files under `entities/`.)

## Offering
What Rootstrap sells. The authoritative **June 2026 Overview** frames it as **two engagement
models** over **six capability areas**; `/ai-landing` adds the AI-native entry points. Mid-pivot:
the AI story leads, delivery breadth supports it (final public IA pending OQ-4).
- **Fields:** name, category, promise, what-we-deliver, business outcome, proof, entry CTA.
- **Engagement models (June 2026 Overview):** **Full Product** (dedicated pod — PM, Data, Backend,
  Frontend, UX/UI, QA, DevOps) · **Staff Augmentation** (embed individuals / hybrid). Pricing =
  **weekly rates by team size, role & seniority; bill only for reviewed-and-approved work.**
  (Supersedes the wiki's 3-model split for *public* framing; cf. `processes/engagement-models`.)
- **Capability areas (June 2026 Overview):** **AI** (Multimodal LLMs, Computer Vision,
  Fine-Tuning & RAG, Agents) · **Data** (ETL & Storage, Visualizations, Quality & Enrichment, ML) ·
  **Cloud** (Infra Automation, APIs, Integrations, Scalability) · **Web** (React, Shopify,
  Webflow CMS, WordPress CMS) · **Mobile** (React Native, iOS, Android, Wearables & IoT) ·
  **Product & Design** (Discovery, Interaction Design, Hi-Fi Prototypes, Product Analytics).
- **AI-native entry points (`/ai-landing` + Overview):** **AI Discovery Sprint (2–6 wks)** →
  AI Readiness & Architecture · AI Product Development · AI Integration for Existing Products.
- **Source of truth:** this Ground Truth (today split across Webflow + wiki + the Overview deck).

## Capability
A unit of *value* (Delivery v2) — and **human-facing**. The "what & why": purpose, actors,
outcomes, scope, capability-level acceptance, and the **list of its user stories**. Sized **C1–C5**.
Stakeholders validate capabilities. (Decision `0007`.)
- **Fields:** name, purpose, actors, outcomes, acceptance criteria, child user-stories, evals, tier, status.

## User Story
**Agent-facing** and executable — the unit an agent implements and an eval verifies. **Many per
capability.** Not an estimation token (no story points / velocity).
- **Fields:** *as-a / I-want / so-that*, actor(s), preconditions, **acceptance criteria as
  Given/When/Then scenarios**, definition of done, evals it maps to, `capability` (parent), status.

## Media Asset / Material
First-class **rich media** (image, video, document) attachable to any artifact — e.g., all the
materials of a case study. Stored in Supabase Storage; placed via **intelligent ingest** (upload →
agent proposes where it belongs → human confirms). (Decision `0008`.)
- **Fields:** type (image/video/doc), file (Storage URL), title/caption, source, `attached_to` (artifact id), credit/rights.

## Case Study / Project
Proof. Wiki holds 167 projects / 65 case studies; site leads with a curated few (OQ-5).
- **Fields:** client, industry, problem, what-we-did, outcome/metrics, tech, persona-fit, tier, shareable?(bool).
- **Lead case studies (confirmed Jun 2026):** MasterClass · The Farmer's Dog · Madison Reed · Emeritus · BetterUp · Door Space.
- **Source of truth:** rootstrapedia `wiki/projects` + `wiki/case-studies` (internal); public subset on site.

## Client
- **Fields:** name, tier (1–4), industries, relationship length, logo-rights?(bool), reference?(bool).
- **Note:** tiering + revenue figures are **internal-only** (OQ-8). Public = logo + outcome only.

## Industry / Vertical
16 in the wiki; `/ai-landing` foregrounds **Healthcare & Wellness, SaaS & Enterprise, Financial
Services & Legal, Healthtech**.
- **Fields:** name, why-Rootstrap, representative clients, regulatory notes.

## Persona / Buyer
The three personas (A Scaling Tech Exec, B Mission-Driven Innovator, C Non-Technical Visionary) +
the AI-native overlay. See `01/audience-and-icp.md`.
- **Fields:** role, situation, core need, hook, guardrails, mapped proof.

## Engagement Model
How work is structured & priced: Staff Aug (flexible/hourly), Product Studio (fixed phases),
Workshops (fixed), and **new: capability / fixed-bid** (validated capabilities). See `business-rules` + Decision `0003`.

## Lead / Inquiry
A site conversion. **Source of truth: HubSpot** (forms + `/contact-hubspot-scheduler`). See `05`.
- **Fields:** name, email, company, persona-guess, offering-interest, message, UTM, sprint-requested?(bool).

## Insight / Blog Post
Thought-leadership; key to **LLM discoverability** (`04/seo-and-llm-discovery.md`).
- **Fields:** title, author, topic, body, canonical-url, structured-data.

## Proof Point / Stat
Reusable credibility atoms. **Verify before publishing** (BR-7). Where sources disagreed, the
**June 2026 Overview is authoritative** (newest + official):
- **Public (June 2026 Overview):** 750+ product launches · **180+ team** (wiki's "200+" — corrected) ·
  14 years · 85% client retention after 1 yr · 1000+ design sprints · **5 $1B+ startups**
  (elsewhere "10+ unicorns" — corrected/flag) · 5 international offices across **US · UY · AR · CO**.
- **Awards:** Inc. 5000 · Financial Times · LA Business Journal (Fastest Growing) ·
  Clutch Top-Rated Agency · Great Place to Work Certified.
- **Trust & compliance:** **SOC 2 certified** · **Anthropic-certified teams** *(do **not** claim
  "Anthropic partner" — in progress, not finalized; see BR-12)* · agentic delivery with
  guardrails, evals & observability.
- **Internal-only (BR-8):** $100M+ raised by clients · $28.8M closed deals · per-client revenue.
> This is BR-7 working: the model caught conflicting stats and resolved to the authoritative
> source. Eval **EV-DATA** (Part 06) keeps published numbers honest.

## Ground Truth Artifact *(meta-entity)*
The site is *about* this. The Explorer renders parts/artifacts/decisions/open-questions as
first-class browsable objects with their metadata. See Part 03 Explorer capability + `explorer/SPEC.md`.
