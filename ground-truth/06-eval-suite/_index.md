---
id: gt-06-index
title: "Eval Suite — Register & Approach"
part: "06-eval-suite"
type: eval
owner: "Product Architect / AI Data Specialist (suggested)"
status: draft
confidence: medium
sources:
  - "Delivery v2 deck (evals; fix-agent-never-verifies-itself) (Jun 2026)"
  - "Notion: AI Delivery Playbook v1.0 (evals must be real, not theatre) (Dec 2025)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer", "ground-truth"]
related: ["gt-02-business-rules", "gt-03-capability-lead-capture", "gt-04-seo-and-llm-discovery"]
tags: ["evals", "quality", "loops"]
---

# 06 · Eval Suite

> An **eval** checks *behaviour* ("does it do the right thing?"), not just "does it run?" — and
> keeps checking as agents change the code. **A fix agent never verifies its own work**; an
> independent eval or agent does (human gate on failures that touch business judgment).

## Eval categories
Functional · Business-rule · Regression · Agent-behaviour · Data-integrity · Discoverability (SEO/GEO) · Accessibility.

## Register (initial)
| ID | Type | Checks | Golden / method | Pass condition |
|----|------|--------|-----------------|----------------|
| **EV-GT-CONSISTENCY** | data-integrity | Every Ground Truth artifact has a valid metadata block; `related`/source links resolve; no `approved` artifact has `last_validated: pending` | parse `ground-truth/**` | 0 violations |
| **EV-DATA** | business-rule | Published stats match the authoritative source (BR-7) | proof-points vs `/sources` Overview | no unverified/contradicted number ships |
| **EV-NO-PLACEHOLDER** | regression | No Lorem Ipsum / placeholder in built output (BR-11) | scan build | 0 matches |
| **EV-PII-URL** | security | No personal data in URLs/query strings | inspect requests | 0 matches |
| **EV-A11Y** | accessibility | WCAG AA on key templates/flows (POUR) | axe + keyboard + SR | 0 blocking violations |
| **EV-SEO-REGRESSION** | regression | Critical content present in server-rendered HTML; metadata/canonicals/structured-data valid; no broken redirects on migration | crawl pre/post | parity-or-better, all 301s resolve |
| **EV-GEO** | discoverability | AI assistants answer "what does Rootstrap do / how do they work" accurately & cite us | scripted prompts to assistants | accurate, current, cited |
| **EV-INTERNAL-LEAK** | business-rule | No BR-8 internal data (revenue, deal sizes, black list) in public output/Explorer | scan public surface | 0 leaks |
| **EV-LEAD-*** | functional/regression | Lead-capture happy path, resilience, a11y | see capability spec | per `03/capability-lead-capture` |
| **EV-CS-FILTER** | functional | Case-study browse/filter by industry & persona; deep-linkable | seeded studies | correct subset; URL reflects filter; empty state |
| **EV-CS-DETAIL** | functional | Detail renders structure + media + structured data | a study w/ media | renders responsively; schema.org present |
| **EV-INGEST-PLACEMENT** | agent-behaviour | Uploaded material classified + placed as a draft in the right artifact | golden upload | proposes correct artifact/part; sources traced |
| **EV-HUMAN-GATE** | business-rule | No publish without human approval (Decision 0008 / BR-5) | attempt auto-publish | blocked; routed to human |

## How evals run (the loop)
Spec defines behaviour → eval/QA agent tests → gap/bug created → fix agent implements →
**independent** review/eval → retest → repeat until pass. Each loop has stop conditions, an
owner, logs, and a human escalation path. Playwright + Vitest are the harness (`04`).

## Principle
Evals are **acceptance criteria, not theatre.** A capability isn't "done" because code runs; it's
done when its evals pass against real cases — and they keep running as agents change the system.
