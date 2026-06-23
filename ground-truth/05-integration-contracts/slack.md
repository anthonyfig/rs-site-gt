---
id: gt-05-slack
title: "Integration Contract — Slack (sales notifications)"
part: "05-integration-contracts"
type: integration-contract
owner: "Head of Sales (suggested) + Platform Architect"
status: draft
confidence: medium
sources:
  - "User (Jun 2026): Slack notifications fire to Sales on new lead and booked call"
  - "gt-05-hubspot (Slack is notification-only; must not block lead creation/booking)"
  - "gt-03-us-lead-scheduling (AC2: notify on submit/booking; AC3: notification never blocks capture)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-03-capability-lead-capture", "gt-05-hubspot", "gt-05-index", "gt-02-business-rules"]
tags: ["slack", "notifications", "lead-capture", "contract"]
---

# Integration Contract — Slack (sales notifications)

Slack is a **notification-only** channel: it tells Sales, in real time, that a lead was captured or
a call was booked. It is **not a source of truth** — every fact lives in HubSpot
([hubspot.md](hubspot.md)). The message is a derived event; losing one causes no data loss. The
hard rule is that a Slack failure must **never** block lead capture or booking.

## Purpose
Give Sales an instant, low-friction heads-up so they can act on a fresh lead or a newly booked call
without watching the CRM. Speed-to-lead, not record-keeping.

## Trigger events
1. **New lead captured** — a form submission creates/updates a HubSpot contact → notify Sales.
2. **Call booked** — a prospect books via the HubSpot Meetings scheduler
   (`/contact-hubspot-scheduler`) → notify Sales.

These mirror the lead-capture flows in [hubspot.md](hubspot.md); Slack fires *after* the
authoritative HubSpot write, never before.

## Direction
One-way, outbound: **site/HubSpot → Slack**. Slack is never read back and never writes anywhere.
The notification can originate from HubSpot's native Slack integration or from a server-side
post to a Slack incoming webhook / `chat.postMessage` (decision is an open question below).

## Payload / fields
Minimal, sales-actionable, and no more PII than the heads-up needs:

| Field | Example | Notes |
|-------|---------|-------|
| Lead name | "Jane Doe" | as submitted |
| Company | "Acme Co." | as submitted |
| UTM / source | `utm_source=linkedin` | attribution for the rep |
| Sprint requested | "AI Discovery Sprint" | which offer/intent, if provided |
| Event type | `new_lead` \| `call_booked` | which trigger fired |
| Link to HubSpot record | (contact/meeting URL) | rep clicks through to the source of truth |

**Do not** put email/phone or any sensitive PII in the message beyond what a rep needs to recognize
and open the record; the canonical detail lives in HubSpot, one click away. No internal-only data
(see Privacy).

## Auth & secrets
- Posting credential — Slack webhook URL or bot token — is held **server-side only** (env/secret
  store), never in client code or URLs.
- If routed through HubSpot's native Slack integration, the connection is managed in HubSpot rather
  than as our own secret.
- Target channel and credential are owned by Sales (see Open questions / [hubspot.md](hubspot.md) OQ-1).

## Failure handling
- **Slack notification failure MUST NOT block** lead creation or booking. The HubSpot write is the
  commit point; the lead/booking succeeds regardless of Slack's state
  (gt-03-us-lead-scheduling AC3, `EV-LEAD-RESILIENCE`).
- Notifications are **non-blocking** — dispatched out of band (queue / async) so a slow or down Slack
  never stalls the capture path.
- On failure: **retry** with backoff and **log** out of band; a permanently dropped notification is
  acceptable (the lead is safe in HubSpot) but should be observable.

## Privacy
- **BR-8:** messages carry lead info only — **never** internal revenue, deal-size, pricing/"AI tax",
  or anti-ICP data. Slack is not a place to leak internal-only fields.
- Keep PII to the minimum needed for recognition; rely on the HubSpot link for full detail.
- No PII in any URL/query string used to build the message.

## Open questions
- Exact **target Slack channel** and the posting mechanism — HubSpot-native Slack integration vs.
  our own server-side webhook/bot token (→ Sales; ties to [hubspot.md](hubspot.md) OQ-1).
- Final message format/wording and whether the two events share one channel or split.

## Sources
See frontmatter. Behaviour confirmed by the user (Jun 2026) and pinned to the resilience rule in
[hubspot.md](hubspot.md) and the acceptance criteria in gt-03-us-lead-scheduling.
