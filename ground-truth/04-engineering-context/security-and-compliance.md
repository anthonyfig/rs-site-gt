---
id: gt-04-security-compliance
title: "Security & Compliance"
part: "04-engineering-context"
type: engineering-context
owner: "Platform Architect (suggested) + Anthony"
status: draft
confidence: medium
sources:
  - "Business Rules: BR-8 (internal-only data), BR-12 (Anthropic wording), BR-13 (trust signals)"
  - "Decision 0005 (Jun 2026): Explorer is internal-only; chat runs on the Anthropic (Claude) API"
  - "AI Delivery Method (02-domain-model/delivery-method.md): safety / observability / compliance trust layer"
  - "Entity Catalog: SOC 2 certified; wiki/processes/soc2-compliance"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-07-0010-git-system-of-record-db-engine", "gt-07-0008-ground-truth-database-backed-and-media", "gt-02-business-rules", "gt-02-delivery-method", "gt-04-data-model"]
tags: ["security", "compliance", "soc2", "rls", "pii", "trust"]
---

# Security & Compliance

> **Scope note:** this is **engineering and compliance-aware practice**, not legal advice. Where a
> claim is customer-facing (e.g. "SOC 2 certified"), the exact wording is governed by the business
> rules — see BR-12 and BR-13.

## Posture in one line
Run a **SOC 2-aligned** build: **authenticate** the internal-only Explorer, **keep secrets and PII
server-side**, **enforce access at the data layer** (RLS, not just UI) — and turn that discipline
into the **safety / observability / compliance** trust layer that regulated buyers sign off on.

## Two things this artifact covers

| | Our own posture (how we build) | The trust layer we sell (what buyers get) |
|---|---|---|
| **Audience** | Engineers + CI building this site/Explorer | Regulated buyers (healthcare, fintech, legal — Persona A/B) |
| **Goal** | Don't leak data; don't ship secrets; pass SOC 2 controls | Guardrails, evals, observability, audit trails on every AI claim |
| **Anchored in** | BR-8, Decision 0005, RLS (data-model) | BR-13, `02-domain-model/delivery-method.md` |

---

## Our posture (how this is built)

### Authentication & the internal-only Explorer
The Ground Truth Explorer is **internal-only** (Decision 0005). It is **not** part of the public
marketing surface and must not be reachable anonymously.
- **Authenticate every Explorer session** (Supabase Auth); no anonymous read path to internal
  artifacts.
- Pair auth with **Row-Level Security** so entitlement is enforced in the database — the UI is a
  convenience, not the security boundary (see `data-model.md`).
- The Explorer's "chat with Ground Truth" runs on the **Anthropic (Claude) API** server-side; the
  API key is a server secret and is never shipped to the browser.

### Internal-only data never leaks (BR-8)
**BR-8** is a hard guardrail: client revenue, deal sizes, per-client figures, tiering, and the
anti-ICP "black list" must never appear in public content or a public Explorer.
- Enforced **structurally** via RLS + an `is_internal` flag on sensitive rows (data-model), so even
  a front-end bug cannot return internal data.
- The marketing build and `llms.txt` derive from Git through the same boundary — internal artifacts
  are never emitted into public HTML or model-facing maps.

### PII handling — HubSpot leads (no PII in URLs)
Leads are a conversion; **HubSpot is the system of record** for them (`05`), and we hold at most a
mirror.
- **No PII in URLs** — never put name/email/company in query strings, paths, redirect targets, or
  analytics events; they get logged, cached, and indexed.
- **No PII in client-side logs or third-party tags.** Submit form data over HTTPS to a server
  endpoint (or HubSpot directly); minimize what we store; prefer HubSpot as the durable store.
- Treat any leads-mirror table as sensitive (internal-only access), same RLS discipline as BR-8 data.

### Secrets — server-side only
- **No secrets in the repo.** All keys/tokens live in an env/secret manager (Anthropic API key,
  Supabase service role, HubSpot token, Storage credentials).
- Secrets are used **only on the server / in Edge Functions** — never bundled into Astro or the
  React app. The browser gets scoped, public anon access at most.
- Git is the system of record for **text, not credentials**; the rebuild pipeline reads secrets from
  the environment, never from committed files.

### Data-layer enforcement & transport
- **RLS-first:** public vs internal is decided in Postgres, consistent with the data model.
- **HTTPS everywhere**; signed/expiring URLs for any non-public media in Supabase Storage rather
  than open bucket links.
- **Least privilege** for service credentials and CI; rotate on a schedule.

### SOC 2 alignment
Rootstrap is **SOC 2 certified** (accurate, achieved — Entity Catalog; wiki/processes/soc2-compliance).
The engineering practices above — access control, secrets hygiene, least privilege, auditability —
**align with** SOC 2 controls; treat them as defaults, not extras. (Stating "SOC 2 certified" is
permitted by BR-13; this artifact does not opine on audit scope, which is a compliance/legal matter.)

---

## The trust layer we sell (BR-13)

For regulated buyers, the differentiator is **"the AI layer your enterprise clients will actually
sign off on"** — the customer-facing expression of the same discipline (`delivery-method.md`). Per
**BR-13**, every AI claim is paired with concrete assurances:

- **Guardrails & human gates** — agents surface decisions to humans; a fix agent never verifies its
  own work (BR-5). Higher autonomy (the Agency Ladder L1→L3) = stricter controls.
- **Evals** — functional, quality, and adversarial/edge-case evaluation as a **build artifact**, run
  in CI, with thresholds that trigger human review (ties to the Evaluation framework deliverable of
  the AI Discovery Sprint).
- **Observability** — behavior is monitored in production ("not just what it does — how it behaves
  when no one's watching"); logs are harvested for the calibration loop.
- **Audit trails** — for this Ground Truth, the audit trail is **Git history** (one commit = one
  validated change = the human gate, Decision 0010); for delivered systems, the equivalent is logged
  decisions + eval runs.
- **Risk register** — data gaps, model failure modes, edge cases, and **regulatory exposure** are
  named before budget is committed (AI Discovery Sprint deliverable 4).

This is the assurance language healthcare, fintech, and legal buyers require, and it is a core part
of the agentic positioning — not a disclaimer bolted on at the end.

## Guardrails for any agent or page generated here
- **Never claim "Anthropic partner"** — only **"Anthropic-certified teams"** is permitted (BR-12);
  the partnership is in progress, not finalized.
- **Never expose BR-8 internal values** in public content or a public Explorer.
- **"SOC 2 certified" is accurate** and may be stated; **do not** invent additional certifications,
  audit scope, or compliance attestations.
- This artifact is **engineering/compliance-aware guidance, not legal advice** — defer
  contractual/regulatory wording to counsel.

## What this is not
- **Not** a SOC 2 audit report or a legal compliance statement.
- **Not** the place for credentials or secret values (those live in the secret manager).
- **Not** a substitute for the human gate — security review and approvals still route to people
  (BR-5).
