# Metadata Schema

Every Ground Truth artifact (parts 01–07) **must** begin with this YAML frontmatter block.
This is the contract that makes the package machine-usable and the Explorer's *Trace* and
*Validate* features possible. No metadata → not Ground Truth.

```yaml
---
id: gt-01-goals-and-scope          # stable, unique, kebab-case; never reused
title: Goals & Scope               # human-readable
part: "01-project-context"         # which blueprint part
type: project-context              # see Types below
owner: "Head of Marketing (suggested) — Anthony, sponsor"  # the human accountable
status: draft                      # draft | in-review | approved | needs-revalidation | deprecated
confidence: medium                 # high | medium | low
sources:                           # provenance — every claim must be traceable
  - "Delivery v2 deck — /sources/ai-native-delivery.html (Jun 2026)"
  - "Notion: Rootstrap ICP & Buyer Persona Report (May 2026)"
  - "rootstrapedia: wiki/marketing/value-propositions.md (Apr 2026)"
updated: 2026-06-22                 # last edit (any)
last_validated: "pending"          # ISO date a human last confirmed truth; 'pending' if never
validated_by: "pending"            # who validated (role/name)
applies_to: ["marketing-site", "explorer"]   # surfaces/capabilities governed
related: ["gt-01-audience-and-icp", "gt-02-vocabulary"]   # cross-links (Explorer edges)
tags: ["positioning"]
---
```

## Field rules

| Field | Required | Notes |
|-------|----------|-------|
| `id` | ✅ | Stable identity. The Explorer and agents reference artifacts by `id`, not path. |
| `title` | ✅ | |
| `part` | ✅ | One of `01-project-context` … `07-decision-log`, or `_schema`. |
| `type` | ✅ | `project-context`, `domain-entity`, `vocabulary`, `business-rule`, `capability-spec`, `user-story`, `media-asset`, `case-study`, `engineering-context`, `integration-contract`, `eval`, `decision`. |
| `owner` | ✅ | A role and/or person. "Unowned" is not allowed; use `owner: "TBD — needs assignment"` and raise an open question. |
| `status` | ✅ | Drives what agents may build from. See lifecycle below. |
| `confidence` | ✅ | `high` requires a primary source **and** human validation. |
| `sources` | ✅ | At least one. Prefer primary (interview, SOP, live page, data) over secondary. Date each. |
| `last_validated` | ✅ | `pending` until a human confirms. An `approved` artifact must have a real date. |
| `applies_to` | ✅ | Keeps scope explicit; lets agents load only relevant context. |
| `related` | ➖ | Cross-links become the Business Twin graph edges. |
| `capability` | ➖ | On a `user-story`: the parent capability's `id` (Decision 0007). |
| `media` | ➖ | Attached `media-asset` ids / paths (images, video, docs) — Decision 0008. |

> **Storage note (Decisions 0009/0010):** **Git is the system of record** for these markdown
> artifacts (the agent-native, canonical format). The database (Supabase) is the **engine** —
> search/graph/chat/RLS — **rebuilt from Git**; **media** lives in Storage; the **Explorer commits to
> Git** behind a UI (a commit per validated change = the history). Not relational-shredded.

## Status lifecycle

```
draft ──▶ in-review ──▶ approved ──▶ needs-revalidation ──▶ (back to in-review)
                               └────────────▶ deprecated
```

- **draft** — authored, not yet reviewed. Agents may read; must flag if building from it.
- **in-review** — in the validation queue with a stakeholder.
- **approved** — a human confirmed it. **Only `approved` artifacts may drive production builds and fixed-bid capabilities.**
- **needs-revalidation** — a source changed or time elapsed; treat as not-approved until re-checked.
- **deprecated** — superseded; kept for history with a pointer to the replacement.

## Confidence rubric

- **high** — corroborated by a primary source and validated by the accountable owner.
- **medium** — single credible source, internally consistent, not yet human-validated.
- **low** — inferred, stale, or sources conflict. Must be resolved at a **human gate** before
  it underwrites a priced capability. (See `07-decision-log` for how conflicts are routed.)

## Sources convention

Write sources so a reader can find the original:
- `Notion: <page title> (<month year>)`
- `rootstrapedia: wiki/<path> (<month year>)`
- `live: https://www.rootstrap.com/<path> (fetched 2026-06-22)`
- `interview: <role>, <date>` · `deck: /sources/<file>`
