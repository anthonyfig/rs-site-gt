---
id: gt-07-0018-contact-form-hubspot-collected-forms
title: "0018 — Contact form via HubSpot Collected Forms (match Webflow)"
part: "07-decision-log"
type: decision
owner: "Anthony + Head of Sales (suggested)"
status: approved
confidence: high
sources:
  - "User directive (Jun 2026): the new contact form must work 'the same way as now — sending to the same HubSpot form as the existing Webflow app.'"
  - "Live inspection of rootstrap.com/contact: form #v3-contact-form has data-hs-cf-bound=true; page loads js-na1.hs-scripts.com/3965030.js + js.hscollectedforms.net/collectedforms.js; window.__hsCollectedFormsDebug present; no hbspt.forms.create / no form GUID."
  - "HubSpot portal 3965030 (get_user_details); Forms API read REQUIRES_REAUTHORIZATION."
updated: 2026-06-24
last_validated: "2026-06-24"
validated_by: "Anthony"
applies_to: ["marketing-site"]
related: ["gt-03-us-lead-submit", "gt-03-us-lead-scheduling", "gt-03-capability-lead-capture", "gt-07-0006-exit-webflow-astro-vercel", "gt-05-hubspot"]
tags: ["adr", "lead", "form", "hubspot", "contact"]
---

# 0018 — Contact form via HubSpot Collected Forms (match Webflow)

**Status:** Approved — Anthony · **Date:** 2026-06-24

## Context
The rebuilt Astro contact form had to keep sending leads to HubSpot exactly as the live Webflow site
does. Inspecting the live `rootstrap.com/contact` showed how that actually works: the form is **not** a
`hbspt.forms.create` embed and has **no standalone HubSpot form GUID**. It is a plain form that HubSpot's
**Collected Forms** feature captures — confirmed by `data-hs-cf-bound="true"`, the loaded
`collectedforms.js` + `js-na1.hs-scripts.com/3965030.js` tracking script, and `window.__hsCollectedFormsDebug`.
Collected Forms maps submissions to contact properties **by field name**, into portal **3965030**.

## Decision
Replicate the existing mechanism rather than introduce a new one:
- Load the **same HubSpot tracking script** (portal `3965030`) site-wide from `Base.astro`, gated by
  `PUBLIC_HUBSPOT_PORTAL_ID` (a public id; unset disables it). This is the script that runs Collected Forms.
- The contact form keeps the **exact Webflow field names** so HubSpot applies the same mappings into the
  same portal: `Name`, `Email`, `Company`, `Tell-Us`, `Meet-Selected-Day`, `Time-Zone`,
  `Meet-Selected-Hour`, plus honeypot `work-email-2`.
- Submit handler calls `preventDefault()` and shows an inline success state; Collected Forms still
  captures the submit event synchronously, so the lead lands the same way it does today.
- The day/time picker is **preferred-time capture** (a principal engineer confirms by email) — it does
  not book live availability. Real self-serve booking stays out of scope here (see LEAD-2).

## Alternatives considered
- **HubSpot Forms Submission API** to a purpose-built form GUID — more robust (server-acknowledged
  success, server-side validation, explicit dedupe) and keeps the custom design, but it's a *different*
  mechanism than today and needs a new form created in HubSpot. **Recommended as a future hardening of
  LEAD-1**, not for "same as now."
- **Vercel serverless + HubSpot private-app token** (could also create a Deal/Note) — more moving parts;
  deferred.

## Consequences / tradeoffs
- Zero backend; identical HubSpot destination + field mappings as the current site.
- Capture depends on the async tracking script having loaded; a submit within ~1s of page load could be
  missed (same risk the Webflow site carries).
- Collected Forms is implicit (no per-submit success/error contract) — weaker than a real form submission.
- A site-wide marketing tracking script has analytics/consent implications.

## Open questions / human gates
- **Consent gating** for the tracking script → reconcile with `gt-03 privacy-respecting-analytics`
  (the live site uses Termly + HubSpot's cookie banner; the Astro site has no consent layer yet).
- Whether to upgrade LEAD-1 to the **Forms Submission API** for guaranteed capture + inline validation.
- `/thank-you` page (Webflow redirects there) vs. the current inline success state.
- Verify one real submission appears in HubSpot after deploy.
