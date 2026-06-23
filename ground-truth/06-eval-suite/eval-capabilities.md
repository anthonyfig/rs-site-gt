---
id: gt-06-eval-capabilities
title: "Capability-Specific Evals (lead · case-study · analytics · navigation · Explorer)"
part: "06-eval-suite"
type: eval
owner: "Product Architect / AI Data Specialist (suggested)"
status: draft
confidence: medium
sources:
  - "ground-truth/03-capability-specs/lead-capture/** (EV-LEAD-* pass conditions)"
  - "ground-truth/03-capability-specs/case-study-showcase/** (EV-CS-*, EV-INGEST-PLACEMENT)"
  - "ground-truth/03-capability-specs/analytics-measurement/** (EV-CONSENT-DEFAULT, EV-CONVERSION-EVENT, EV-METRIC-MAPPING)"
  - "ground-truth/03-capability-specs/navigation-search/** (EV-NAV)"
  - "ground-truth/03-capability-specs/ground-truth-explorer/** (EV-EXPLORER-*)"
  - "gt-02-delivery-method (Functional / Quality / Edge-case eval layers)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-06-index", "gt-03-index", "gt-02-delivery-method"]
tags: ["evals", "lead-capture", "case-study", "analytics", "navigation", "explorer"]
---

# Capability-Specific Evals

The per-capability functional and quality evals, with the pass condition taken from each
capability's user-story scenario tables in `03-capability-specs`. Shared evals (`EV-A11Y`,
`EV-SEO-REGRESSION`, `EV-DATA`, `EV-INTERNAL-LEAK`, `EV-NO-PII-URL`, `EV-NO-PLACEHOLDER`,
`EV-HUMAN-GATE`, `EV-GT-CONSISTENCY`) are defined in [`_index.md`](_index.md). All evals below map to
the **Functional** layer of `02/delivery-method` unless marked otherwise.

## Lead capture → AI Discovery Sprint
Capability: `gt-03-capability-lead-capture`. Stories: `lead-capture/us-1…us-3`.

| ID | Layer | Verifies | Pass condition | Mode |
|----|-------|----------|----------------|------|
| **EV-LEAD-HAPPY** | functional | A valid submission creates exactly one attributed lead | One HubSpot contact per valid submit, with correct source/UTM attribution + persona; **no duplicate** on repeat (upsert by email) | **Automated** (Playwright + HubSpot test) |
| **EV-LEAD-RESILIENCE** | functional / edge-case | A lead is never lost when a downstream call fails | On a forced downstream failure the lead is **queued and retried**, not dropped; Slack/notification failure never blocks capture | **Automated** (fault injection) |
| **EV-LEAD-A11Y** | functional / quality | The form is usable by everyone | Form fields, labels, and **inline errors** are accessible (WCAG AA); **no blocking CAPTCHA**; keyboard-operable | **Automated** (axe) + **human-gated** SR spot-check |

## Case-study showcase
Capability: `gt-03-capability-case-study-showcase`. Stories: `case-study-showcase/us-1…us-3`.

| ID | Layer | Verifies | Pass condition | Mode |
|----|-------|----------|----------------|------|
| **EV-CS-FILTER** | functional | Browse/filter case studies by industry & persona | Filter returns the **correct subset**; the URL reflects the active filter (deep-linkable); an **empty state** is shown when nothing matches | **Automated** (seeded studies) |
| **EV-CS-DETAIL** | functional | A case-study detail renders fully | Renders sections + media **responsively**; valid **schema.org** present; only **verified** metrics shown (`EV-DATA`), 0 internal figures (`EV-INTERNAL-LEAK`) | **Automated** + **human-gated** (media/quote/logo rights confirmed before publish) |
| **EV-INGEST-PLACEMENT** | functional / agent | Uploaded case-study material is placed correctly | The agent proposes the **correct artifact/part** with **sources traced**; internal figures are flagged + excluded; placement confirmed behind `EV-HUMAN-GATE` | **Automated** golden-upload check; placement **human-gated** |

## Analytics & measurement
Capability: `gt-03-capability-analytics-measurement`. Stories: `analytics-measurement/us-1…us-2`.

| ID | Layer | Verifies | Pass condition | Mode |
|----|-------|----------|----------------|------|
| **EV-CONSENT-DEFAULT** | edge-case / guardrail | Non-essential tracking is off until opt-in | **No** non-essential tracker/cookie fires before opt-in; declining/ignoring consent **persists** a privacy-preserving state | **Automated** (request inspection) |
| **EV-CONVERSION-EVENT** | functional | The key conversion is tracked once, attributed, and reaches HubSpot | **Exactly one** event per successful conversion; **source/UTM** captured on the event and on the HubSpot contact; reaches HubSpot **idempotently** | **Automated** |
| **EV-METRIC-MAPPING** | functional | Reports tie to real goals, not vanity counts | **Every** tracked event maps to a **named success metric** in `01/constraints-and-success-metrics` | **Automated** check of the event→metric map + **human-gated** sign-off (Head of Sales/Growth) |

## Navigation & search
Capability: `gt-03-capability-navigation-search`. Stories: `navigation-search/us-1…us-3`.

| ID | Layer | Verifies | Pass condition | Mode |
|----|-------|----------|----------------|------|
| **EV-NAV** | functional | Visitors can orient, move, and find content | Current section flagged with `aria-current` + a visual state; the **"Start a Discovery Sprint" CTA → `/contact`** is reachable on desktop and mobile; the **mobile menu** exposes the same destinations + CTA and is keyboard-operable (opens/closes, Escape closes); **footer links resolve** (no 404/placeholder, no internal-only links); collection indexes are reachable | **Automated** (Playwright, both viewports) |

## Ground Truth Explorer (internal-only)
Capability: `gt-03-capability-explorer`. Stories: `ground-truth-explorer/us-1…us-6`. Every Explorer
eval also runs `EV-INTERNAL-LEAK`, `EV-A11Y`, and `EV-GT-CONSISTENCY` from `_index.md`.

| ID | Layer | Verifies | Pass condition | Mode |
|----|-------|----------|----------------|------|
| **EV-EXPLORER-TABLE** | functional | The core browse/management table (US-1) | **Every** artifact has a row with the five columns (status, owner, confidence, area, last-validated); **sort and filter** return correct subsets; **empty state** shown | **Automated** |
| **EV-EXPLORER-MAP** | functional | The focus+context relationship map (US-2) | **Exactly one** artifact centered; **only direct** neighbours rendered; click **recenters**; back restores the prior center; the **global graph is never** rendered | **Automated** |
| **EV-EXPLORER-HEALTH** | functional | The health/gaps panel (US-3) | Each group (needs-revalidation, low-confidence, unowned, still-draft, capabilities lacking stories, open questions) lists **exactly** the matching artifacts — **no false positives or omissions**; selecting one **opens the correct artifact** | **Automated** |
| **EV-EXPLORER-ASK** | quality | Ask-the-Ground-Truth chat with citations (US-4) | Every substantive claim carries a **citation** that opens to a real, supporting artifact; an out-of-scope question yields an honest **"not found"**, not a fabricated claim | **Human-gated** (answers are non-deterministic; citations spot-checked) |
| **EV-EXPLORER-VALIDATE** | functional | Validate → clean commit (US-5) | Confirmation yields **exactly one clean commit** updating `last_validated` / `validated_by`; nothing is committed without confirmation (`EV-HUMAN-GATE`); after rebuild the engine state matches the committed Git file (`EV-GT-CONSISTENCY`) | **Automated** |
| **EV-EXPLORER-INGEST** | functional | Ingest a document → proposed placement → human gate (US-6) | The proposal names plausible target artifact(s)/part + proposed changes (`EV-INGEST-PLACEMENT`); on confirm, **media is stored and exactly one clean commit** applies the change; nothing written without confirmation (`EV-HUMAN-GATE`) | **Automated** check; write **human-gated** |

## Notes & assumptions

- **`EV-INGEST-PLACEMENT` is shared** across the case-study, content-publishing, and Explorer-ingest
  flows — it is the "did the agent classify + place uploaded material correctly" eval, distinct from
  `EV-EXPLORER-INGEST` (the Explorer's commit/storage mechanics on confirm).
- **`EV-METRIC-MAPPING` and `EV-CONVERSION-EVENT`** are inferred to be partly human-gated only for
  the metric→event mapping **sign-off** (the analytics capability lists that sign-off as an open
  question for the Head of Sales/Growth); the firing/attribution checks themselves are automated.
- **`EV-GEO` and `EV-EXPLORER-ASK`** are marked human-gated because both judge non-deterministic
  model output; the scripted prompts and citation spot-checks are run by the AI Data Specialist.
