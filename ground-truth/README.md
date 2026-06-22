# Rootstrap Ground Truth — Website Pilot

> **Ground Truth** — a precise, living model of how the business actually works: its
> processes, rules, data, integrations and decisions. It is accurate enough that both
> people and AI agents can build on it. The software is increasingly *derived* from it.
> — *Rootstrap Delivery v2 / AI-Native Delivery* (see [`/sources/ai-native-delivery.html`](../sources/ai-native-delivery.html))

This directory is the **Ground Truth for the new Rootstrap website** — and the **first
real application of the Rootstrap Ground Truth Blueprint**. From here on, this is how we
intend to manage every project. This one is the starting point.

The principle that governs everything in here:

> **If it is not structured, owned, versioned, and validated, it is not Ground Truth.**

So a folder of notes is not Ground Truth. This is a structured, versioned package with an
owner and a validation state on every artifact. The browsable, conversational surface over
it — the thing stakeholders actually use to *query, challenge, and correct* the model — is
the **[Ground Truth Explorer](../explorer/SPEC.md)**. The client never receives "15 markdown
files"; they receive a navigable Business Twin. These files are the source the Explorer reads.

---

## The delivery flow this enables

```
Knowledge  →  Ground Truth  →  Specs  →  Agents  →  Software
             (this package)   (part 03)  (loops)   (derived)
```

Phases: **1. Ground Truth → 2. Architecture → 3. Capability Delivery → 4. Continuous Evolution.**
We are in Phase 1 for this project.

---

## The Blueprint — 7 parts

Every Ground Truth package has the same standard shape. Each part links to its own index.

| # | Part | What it holds | Status |
|---|------|---------------|--------|
| 01 | [Project Context](01-project-context/_index.md) | Goals, users, stakeholders, constraints, success metrics, non-goals, open questions | 🟡 Draft (seeded) |
| 02 | [Domain Model](02-domain-model/_index.md) | Entities, relationships, vocabulary, states, business rules, edge cases | 🟡 Draft (seeded) |
| 03 | [Capability Specs](03-capability-specs/_index.md) | Purpose, actors, triggers, happy/alternate paths, acceptance criteria, permissions, error cases, evals | 🟠 1 exemplar + index |
| 04 | [Engineering Context](04-engineering-context/_index.md) | Architecture, stack, repo structure, patterns, conventions, security, deployment | 🟡 Draft (seeded) |
| 05 | [Integration Contracts](05-integration-contracts/_index.md) | External systems, APIs, auth, source-of-truth per field, sync direction, failure/retry | ⚪ Index + register |
| 06 | [Eval Suite](06-eval-suite/_index.md) | Functional, business-rule & regression evals, golden examples, agent-behaviour & data-integrity checks | ⚪ Index + approach |
| 07 | [Decision Log](07-decision-log/_index.md) | Decisions, owner, date, rationale, alternatives, tradeoffs, impact | 🟢 4 decisions logged |

---

## Every artifact carries metadata

This is non-negotiable and is what separates Ground Truth from documentation. Every file in
parts 01–07 opens with a YAML block defined in [`_schema/metadata-schema.md`](_schema/metadata-schema.md):

```yaml
owner:          # the human accountable for this being true
status:         # draft → in-review → approved → needs-revalidation → deprecated
confidence:     # high | medium | low
sources:        # where this claim comes from — interview, SOP, deck, page, ticket
last_validated: # when a human last confirmed it
applies_to:     # which surfaces/capabilities this governs
```

> Example: `owner: Head of Marketing · status: approved · source: ICP Report (May 2026) +
> COO interview · confidence: high · last_validated: 2026-06-22`

### Status lifecycle

`draft` → `in-review` → **`approved`** → `needs-revalidation` → `deprecated`

- Agents may **read** anything, but may only **build production software from `approved`** artifacts.
- Building from `draft`/`in-review` is allowed for spikes **only if the agent flags the dependency** and routes it to a human gate.
- A source change that touches an `approved` artifact flips it to `needs-revalidation`.

### Confidence

`high` (validated against a primary source + human), `medium` (single source, plausible,
unvalidated), `low` (inferred or conflicting — must be resolved at a human gate before it
drives a fixed-bid capability).

---

## How this maps to the Explorer (Ask / Browse / Trace / Validate / Generate)

The [Explorer](../explorer/SPEC.md) is the product surface over these files:

- **Ask** — "How does lead capture work?" "Which system owns this field?" → answered from these files.
- **Browse** — by part, entity, capability, decision, open question.
- **Trace** — every claim links back to its `sources` with confidence + last-validated date.
- **Validate** — stakeholders approve / correct / flag; changes enter a review queue (status moves).
- **Generate** — capability specs, acceptance criteria, evals, agent tasks — straight from the model.

---

## Versioning

- The **Ground Truth text is Git-versioned markdown** — the agent-native, canonical format and its
  **system of record**. **Media** lives in object storage; the **database is the engine**
  (search/graph/chat) **rebuilt from Git**; the **Explorer is a Git-backed UI** that commits a clean
  change per validated edit (you never see Git). Decisions [0009](07-decision-log/0009-format-files-canonical-db-engine.md)/[0010](07-decision-log/0010-git-system-of-record-db-engine.md). This is **GT v0.1 (draft for validation)**.
- Material changes are recorded in [`07-decision-log`](07-decision-log/_index.md).
- The package gets a semantic version when Part 01 + 02 reach `approved` (target: **v1.0 = validated**).

## What to do next (human gate)

This is a **draft for stakeholder validation**. Nothing here is `approved` yet. See the
[validation checklist](01-project-context/_index.md#validation) and the
[open questions](01-project-context/non-goals-and-open-questions.md).

---
*Git-versioned markdown is the canonical, agent-friendly format and system of record; the database is the engine; the Explorer is a Git-backed UI (Decisions 0009/0010). Owner: Anthony (project sponsor). Drafted 2026-06-22.*
