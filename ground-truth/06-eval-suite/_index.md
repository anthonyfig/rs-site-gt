---
id: gt-06-index
title: "Eval Suite — Catalog & Approach"
part: "06-eval-suite"
type: eval
owner: "Product Architect / AI Data Specialist (suggested)"
status: draft
confidence: medium
sources:
  - "gt-02-delivery-method (eval layers: Functional / Quality / Edge-case-adversarial; human gates)"
  - "gt-02-business-rules (BR-7 EV-DATA, BR-8 EV-INTERNAL-LEAK, BR-11 EV-NO-PLACEHOLDER, BR-12, BR-13)"
  - "ground-truth/03-capability-specs/** (every EV-* referenced by a capability or user story)"
  - "tools/ground-truth/check.mjs + lib.mjs (EV-GT-CONSISTENCY — implemented)"
  - "Delivery v2 deck (evals; 'a fix agent never verifies itself') (Jun 2026)"
  - "Notion: AI Delivery Playbook v1.0 (evals must be real, not theatre) (Dec 2025)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer", "ground-truth"]
related: ["gt-02-delivery-method", "gt-02-business-rules", "gt-03-index", "gt-04-seo-and-llm-discovery", "gt-06-eval-capabilities"]
tags: ["evals", "quality", "guardrails", "loops"]
---

# 06 · Eval Suite

> An **eval** checks *behaviour* ("does it do the right thing?"), not just "does it run?" — and
> keeps checking as agents change the code. **A fix agent never verifies its own work** (BR-5); an
> independent eval or agent does, with a **human gate** on failures that touch business judgment.
> Evals are **acceptance criteria, not theatre.** A capability isn't "done" because code runs; it's
> done when its evals pass against real cases.

This catalog is the single registry for every `EV-*` referenced anywhere in the Ground Truth. Each
eval has a **kind**, a **delivery-method layer**, the **capabilities/stories it serves**, a concrete
**pass condition**, and whether it is **automated** or **human-gated**. The capability-specific evals
(lead, case-study, analytics, navigation, Explorer) live in the companion file
[`eval-capabilities.md`](eval-capabilities.md) and are summarised here.

## Mapping to the delivery-method eval layers

`02/delivery-method` defines three eval layers plus the guardrail/human-gate substrate. Every eval
in this suite maps to one of these:

| Layer (from `02/delivery-method`) | What it asks | Evals in this suite |
|-----------------------------------|--------------|---------------------|
| **Functional** | Did it actually work? | `EV-LEAD-HAPPY`, `EV-LEAD-RESILIENCE`, `EV-CS-FILTER`, `EV-CS-DETAIL`, `EV-CONVERSION-EVENT`, `EV-METRIC-MAPPING`, `EV-NAV`, `EV-EXPLORER-TABLE`, `EV-EXPLORER-MAP`, `EV-EXPLORER-HEALTH`, `EV-EXPLORER-VALIDATE`, `EV-EXPLORER-INGEST`, `EV-INGEST-PLACEMENT` |
| **Quality** | Is the output semantically right / accurate / discoverable? | `EV-DATA`, `EV-GEO`, `EV-A11Y`, `EV-SEO-REGRESSION`, `EV-EXPLORER-ASK` |
| **Edge-case / adversarial** | Does it hold under hostile or unusual input? | `EV-INTERNAL-LEAK`, `EV-NO-PII-URL`, `EV-CONSENT-DEFAULT`, `EV-HUMAN-GATE`, `EV-NO-PLACEHOLDER` |
| **Guardrail + human gate (substrate)** | Is a business-judgment line enforced before publish? | `EV-INTERNAL-LEAK`, `EV-DATA`, `EV-HUMAN-GATE`, `EV-NO-PLACEHOLDER`, `EV-NO-PII-URL` |
| **Structural / model integrity** | Is the Ground Truth itself consistent? | `EV-GT-CONSISTENCY` |

> Several guardrail evals are deliberately listed twice: they are *adversarial* in how they are
> tested (try to make the system leak/ship a placeholder) and *guardrail* in why they exist (a hard
> BR line). That is intentional, not a duplicate.

## Structural / model integrity

| ID | Kind | Verifies | Serves | Pass condition | Mode |
|----|------|----------|--------|----------------|------|
| **EV-GT-CONSISTENCY** | structural | Every Ground Truth artifact is metadata-complete with a valid `status`; the model the Explorer shows matches the canonical Git files | Explorer US-1…US-6; Decision 0008/0010; whole Ground Truth | `tools/ground-truth/check.mjs` exits 0 (0 errors); Explorer views/edges/citations match the committed Git artifact after rebuild | **Automated** (implemented in `check.mjs` / `lib.mjs`) |

## Guardrail (business-rule lines, enforced before publish)

| ID | Kind | Verifies | Serves | Pass condition | Mode |
|----|------|----------|--------|----------------|------|
| **EV-INTERNAL-LEAK** | guardrail / edge-case | No BR-8 internal data (client revenue, deal sizes, per-client $, tiering, anti-ICP "black list") reaches any public surface, analytics payload, or non-internal Explorer user | case-study showcase, content-publishing, discoverability, analytics, insights, Explorer (all stories) | Scan of every public surface + analytics/Slack payloads = 0 internal figures; no internal-only artifact served to a non-internal user | **Automated** scan + **human-gated** review on ambiguous cases |
| **EV-NO-PLACEHOLDER** | guardrail / edge-case | No Lorem Ipsum / placeholder content ships (BR-11) | content-publishing, discoverability, insights, navigation | Scan of built output = 0 placeholder/lorem matches; unknowns recorded as open questions instead | **Automated** |
| **EV-NO-PII-URL** | guardrail / edge-case | No personal data in URLs, query strings, or analytics payloads; secure transport | lead-capture (US-3), analytics (US-1, US-2) | Inspect requests/URLs/payloads = 0 PII; transport is HTTPS | **Automated** |
| **EV-DATA** | guardrail / quality | Every published proof point / stat matches a verified primary source (BR-7); no BR-12 false "Anthropic partner" wording | case-study showcase, content-publishing, discoverability, insights | No unverified or contradicted number ships; published stats reconcile to `/sources` / approved Ground Truth; BR-12 wording honoured | **Human-gated** (Marketing verifies the source) |
| **EV-HUMAN-GATE** | guardrail | No publish or model write happens without explicit human approval (BR-5 / Decision 0003 / 0008 / 0010) | case-study ingest, content ingest, Explorer validate (US-5) + ingest (US-6) | Attempted auto-publish / auto-commit is blocked and routed to a human; nothing is written without explicit confirmation; no raw Git path exposed | **Automated** check that the gate exists + **human-gated** by design |

## Cross-cutting site evals

| ID | Kind | Verifies | Serves | Pass condition | Mode |
|----|------|----------|--------|----------------|------|
| **EV-SEO-REGRESSION** | quality / regression | Critical content is in server-rendered HTML; titles/descriptions/canonicals/OG + schema.org valid; sitemap & robots valid; legacy URLs 301 in one hop with no orphan 404s | discoverability (US-1/2/3), content-publishing, case-study, navigation, insights, blog migration | Crawl pre/post launch = parity-or-better; all 301s resolve in one hop, 0 orphan 404s; structured data validates | **Automated** (crawl + validators) |
| **EV-GEO** | quality / discoverability | AI assistants answer "what does Rootstrap do / how do they work" accurately and current, and can use `llms.txt`; facts match the live site | discoverability (US-2), content-publishing, insights | Scripted prompts to assistants return accurate, current answers; `llms.txt` is fetchable + parseable and contradiction-free vs the live site | **Human-gated** (scripted prompts reviewed by a human; assistant output is non-deterministic) |
| **EV-A11Y** | quality | WCAG AA on key templates and flows (POUR): headings/landmarks/alt, keyboard operability, screen-reader use | every capability (shared) | axe + keyboard + screen-reader pass = 0 blocking violations on the tested template/flow | **Automated** (axe) + **human-gated** SR spot-check |

## Capability-specific evals (summary)

Full pass conditions and the per-story scenario tables are in
[`eval-capabilities.md`](eval-capabilities.md). Summary:

| ID | Kind | Capability | One-line check |
|----|------|-----------|----------------|
| **EV-LEAD-HAPPY** | functional | lead-capture | One attributed HubSpot contact per valid submit; idempotent on repeat |
| **EV-LEAD-RESILIENCE** | functional | lead-capture | A failed downstream call queues + retries the lead; it is never lost |
| **EV-LEAD-A11Y** | functional / quality | lead-capture | Form + inline errors accessible; no blocking CAPTCHA |
| **EV-CS-FILTER** | functional | case-study showcase | Browse/filter by industry & persona returns the correct subset; deep-linkable; empty state shown |
| **EV-CS-DETAIL** | functional | case-study showcase | Detail renders sections + media responsively with valid schema.org |
| **EV-INGEST-PLACEMENT** | functional / agent | case-study, content-publishing, Explorer ingest | Uploaded material is classified and proposed into the correct artifact/part with sources traced |
| **EV-CONSENT-DEFAULT** | edge-case / guardrail | analytics | No non-essential tracker/cookie fires before opt-in; decline persists a privacy-preserving state |
| **EV-CONVERSION-EVENT** | functional | analytics | The key conversion fires exactly once with source/UTM and reaches HubSpot idempotently |
| **EV-METRIC-MAPPING** | functional | analytics | Every tracked event maps to a named success metric in `01` — no vanity counts |
| **EV-NAV** | functional | navigation-search | Current-section indication, mobile-menu parity (+ CTA), index reachability, footer links resolve |
| **EV-EXPLORER-TABLE** | functional | Explorer US-1 | Every artifact has a row with the five columns; sort/filter return correct subsets; empty state shown |
| **EV-EXPLORER-MAP** | functional | Explorer US-2 | Exactly one artifact centered; only direct neighbours; click recenters; never the global graph |
| **EV-EXPLORER-HEALTH** | functional | Explorer US-3 | Each health group lists exactly the artifacts matching its rule; selecting one opens the right artifact |
| **EV-EXPLORER-ASK** | quality | Explorer US-4 | Every substantive claim carries a citation to a real supporting artifact; out-of-scope → honest "not found" |
| **EV-EXPLORER-VALIDATE** | functional | Explorer US-5 | Confirmation yields exactly one clean commit updating `last_validated` / `validated_by` |
| **EV-EXPLORER-INGEST** | functional | Explorer US-6 | On confirm, media is stored and exactly one clean commit applies the change |

## How evals run (the loop)

Spec defines behaviour → eval/QA agent tests → gap/bug created → fix agent implements →
**independent** review/eval → retest → repeat until pass. Each loop has stop conditions, an owner,
logs, and a human escalation path. Playwright + Vitest are the harness (`04`); `EV-GT-CONSISTENCY`
runs via `tools/ground-truth/check.mjs`. The QA role evolves into the **AI Data Specialist** who
curates the reference dataset and reviews eval failures (`02/delivery-method`).

## Naming note (canonical IDs)

- `EV-NO-PII-URL` is canonical (Part 03). An earlier draft of this register used `EV-PII-URL`; it is
  the **same** eval — references should use `EV-NO-PII-URL`.
- The lead-capture suite is three concrete evals — `EV-LEAD-HAPPY`, `EV-LEAD-RESILIENCE`,
  `EV-LEAD-A11Y` — not a single `EV-LEAD-*`. The `*` form is shorthand for "the lead-capture evals".

## Principle

Evals are **acceptance criteria, not theatre.** A capability is done when its evals pass against real
cases — and they keep running as agents change the system, with a human gate on business judgment.
