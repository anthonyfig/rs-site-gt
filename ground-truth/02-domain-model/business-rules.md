---
id: gt-02-business-rules
title: "Business Rules & Guardrails"
part: "02-domain-model"
type: business-rule
owner: "Anthony (sponsor) + Delivery leadership"
status: draft
confidence: high
sources:
  - "Notion: AI Delivery Playbook v1.0 (Dec 2025)"
  - "Delivery v2 deck — /sources/ai-native-delivery.html (Jun 2026)"
  - "Notion: ICP & Buyer Persona Report (May 2026)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-02-vocabulary", "gt-07-0003-reconcile-fixed-bid-vs-never-fixed-price"]
tags: ["rules", "guardrails", "pricing"]
---

# Business Rules & Guardrails

Rules that constrain how the business — and therefore the site's claims and the Explorer's
generated artifacts — must behave. Each is a hard constraint, not a preference.

| # | Rule | Source | Why it matters to the site |
|---|------|--------|----------------------------|
| **BR-1** | Only **`approved`** Ground Truth may drive a production build or a priced capability. | Blueprint / metadata schema | The Explorer must visibly distinguish draft vs approved; pricing claims rest on approved truth. |
| **BR-2** | **No fixed-price L2/L3 (agentic/autonomous) AI without a paid Discovery first.** | AI Delivery Playbook | The site sells "fixed-bid" carefully — it's fixed-bid *after* discovery validates Ground Truth. See BR-3 + Decision `0003`. |
| **BR-3** | We fixed-price **validated capabilities**, not effort and not open-ended autonomy. | Delivery v2 | Reconciles the apparent conflict with BR-2; both are true. Pricing copy must reflect this. |
| **BR-4** | The **"smart intern" test** gates AI suitability: if a smart intern given the same inputs + docs couldn't produce the output, it's not yet an AI-agent candidate. | AI Delivery Playbook | Sets honest expectations in AI-offering copy; anti-hype. |
| **BR-5** | **Agents surface decisions to humans; they don't invent business reality.** Fix agents never verify their own work. | Delivery v2 (human gates) | The method we *sell* and the method we *use to build the site* are the same. |
| **BR-6** | **Capability sizing C1–C5**: C1 single workflow · C2 multi-workflow · C3 cross-functional · C4 platform · C5 strategic transformation. Track lead time + complexity absorbed, **not** "capabilities per week" as a velocity metric. | Delivery v2 (A3) | Any "how we scope" content uses this, and avoids the story-points trap. |
| **BR-7** | **Published proof points must be verified** against a primary source before going live; numbers vary across materials (e.g., "750+" vs "750+/700+" products, retention %). | Multiple sources disagree | Protects credibility; ties to eval EV-DATA in Part 06. |
| **BR-8** | **Confidential data stays internal:** client revenue, deal sizes ($28.8M), per-client $ figures, tiering, and the anti-ICP "black list" never appear in public site content or a public Explorer. | ICP Report + wiki sensitivity | Hard guardrail for any agent generating public content. |
| **BR-9** | **Persona C (Non-Technical Visionary) engagements require a liquidity/runway check** before commitment. | ICP Report | If the site adds a "founder" path, qualification logic in HubSpot reflects this. |
| **BR-10** | **Win on trajectory + partnership, not lowest price.** Don't lead with "40–60% cheaper" (opens the door to cheaper competitors). | ICP Report + elevator-pitch | Messaging guardrail: lead with outcomes and mechanism. |
| **BR-11** | **No placeholder content ships.** Unknowns are recorded as open questions, never Lorem Ipsum. | Project constraint | The current site's placeholder carousel is exactly the failure mode to avoid. |
| **BR-12** | **Anthropic claims — exact wording only:** ✅ may state **"Anthropic-certified teams"** (true now). ❌ must **not** claim **"Anthropic partner"** — partnership is **in progress, not finalized.** Revisit when official. | User direction (Jun 2026) | A false partnership claim is a legal + credibility risk and gets amplified by LLMs (sibling of BR-7). |
| **BR-13** | **Trust signals are first-class:** state **SOC 2 certified** (achieved), and pair every AI claim with **guardrails, loops, evals, observability, audit trails.** | User direction (Jun 2026) + wiki/processes/soc2-compliance | The exact assurance language regulated buyers (healthcare, fintech, legal) require; a core differentiator for the agentic positioning. |

## Edge cases / exceptions
- Existing **T&M engagements** keep their current process (Jira, backlog, sprints) — the new
  model is led-with on *new* opportunities only. (Delivery v2, "The transition".)
- Where Ground Truth `confidence: low` or sources conflict, the rule is **stop and route to a
  human gate** (BR-5) — do not publish or price.
