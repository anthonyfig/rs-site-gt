---
id: gt-05-index
title: "Integration Contracts — Register"
part: "05-integration-contracts"
type: integration-contract
owner: "Platform Architect (suggested)"
status: draft
confidence: medium
sources:
  - "live: rootstrap.com (Webflow), /contact-hubspot-scheduler, GTM-K48G3TB (fetched 2026-06-22)"
  - "Tooling observed in this workspace: HubSpot connector; Webflow project 'RS2.0 - MASTER'"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-03-capability-lead-capture", "gt-03-capability-explorer", "gt-04-stack-and-architecture", "gt-02-business-rules", "gt-07-0005-explorer-internal-claude-chat"]
tags: ["integrations", "contracts"]
---

# 05 · Integration Contracts

External systems the site/Explorer touch, with the **source of truth per concern**, sync
direction, auth, and failure handling. (Each row becomes its own contract file as it's built.)

| System | Role | Source of truth for | Sync | Auth | Failure/retry |
|--------|------|---------------------|------|------|---------------|
| **HubSpot** | CRM, **forms**, **direct call scheduling** (HubSpot Meetings, `/contact-hubspot-scheduler`) | **Leads / contacts / meetings / pipeline** | site → HubSpot (write); read known-contact | Server-side token (never client) | Durable queue + idempotent retry by email. Full contract → [hubspot.md](hubspot.md) |
| **Slack** | **Real-time notifications** on new lead & booked call | — (notification only; not a source of truth) | site/HubSpot → Slack (event) | Server-side webhook/token (or HubSpot↔Slack integration) | Non-blocking: must **not** block lead creation/booking if Slack is down. Full contract → [slack.md](slack.md) |
| **Webflow** ("RS2.0 - MASTER") | Current marketing host/CMS | Current public content (until OQ-3) | n/a | — | Keep-vs-migrate decision = OQ-3 |
| **Supabase** | Explorer backend | Explorer data: artifact mirror, validations/review-queue, embeddings | GT files → Postgres/pgvector (build/sync) | RLS + Auth | RLS enforces BR-8 (no internal data served public) |
| **Anthropic (Claude) API** | Powers Explorer **"Ask the Ground Truth"** chat (retrieval over GT) | — (answers cite artifacts; not a source of truth) | Explorer backend → Claude API (server-side) | **Server-side API key** (never client) | No relevant content → honest "not found", never fabricate; internal-only (BR-8). Full contract → [anthropic-api.md](anthropic-api.md) |
| **Analytics / GTM** | Measurement (`GTM-K48G3TB` observed) | Behavioural metrics | site → GTM | — | Privacy: no PII in URLs/params |
| **AI crawlers** | LLM discovery (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) | Discovery/citation | robots policy | — | Allow public only; never expose BR-8 data |
| **Notion / rootstrapedia** | Internal content sources | Internal knowledge (NOT public) | one-way in (curated) | internal | BR-8: internal-only by default |

## Contract rules
- **One source of truth per field.** Leads live in HubSpot; the site never becomes a shadow CRM.
- **Secrets server-side only.** No tokens in client code or URLs.
- **Internal vs public is enforced at the data layer** (RLS), not just the UI (BR-8).
- Detailed per-system contracts (endpoints, payloads, webhooks) are authored when each capability
  that needs them is built. Authored so far: [hubspot.md](hubspot.md) (lead-capture forms,
  Meetings scheduling), [slack.md](slack.md) (sales notifications), and
  [anthropic-api.md](anthropic-api.md) (Explorer "Ask the Ground Truth" chat).
