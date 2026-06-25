---
id: gt-03-us-lead-submit
title: "LEAD-1 · Submit & create an attributed contact"
part: "03-capability-specs"
type: user-story
owner: "Head of Sales (suggested)"
status: draft
delivery_status: shipped
confidence: medium
sources: ["Capability gt-03-capability-lead-capture", "gt-05-hubspot", "gt-01-audience-and-icp"]
updated: 2026-06-24
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-lead-capture
related: ["gt-03-capability-lead-capture", "gt-05-hubspot", "gt-07-0018-contact-form-hubspot-collected-forms"]
tags: ["lead", "form", "hubspot"]
---

# User story: Submit & create an attributed contact

**As a** visitor **I want** to submit an inquiry / request a Discovery Sprint **so that** I start a
conversation — landing as one attributed HubSpot contact.

## Acceptance criteria — scenarios
**Scenario (US-lead-submit-AC1): Happy path**
- **Given** the capture form (name, work email, company, what they're building, persona signal)
- **When** I submit valid input
- **Then** exactly **one** HubSpot contact is created/updated, with UTM/source + persona signal captured.

**Scenario (US-lead-submit-AC2): Returning contact — no duplicate**
- **Given** a known email
- **When** it submits again
- **Then** the existing contact is updated, not duplicated.

**Scenario (US-lead-submit-AC3): Validation**
- **Given** invalid input
- **Then** I see inline, accessible error messaging; nothing is sent.

## Definition of done
- [ ] All scenarios pass · WCAG AA · no placeholder · no pricing promise (Decision 0003).

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-LEAD-HAPPY` | 1 contact, correct attribution + persona |
| AC2 | `EV-LEAD-HAPPY` | no duplicate on repeat |
| AC3 | `EV-LEAD-A11Y` | accessible inline errors |

## Implementation (Decision 0018)
- **Mechanism:** HubSpot **Collected Forms** — the portal `3965030` tracking script (loaded site-wide in
  `Base.astro`, gated by `PUBLIC_HUBSPOT_PORTAL_ID`) captures the submit and maps by **field name**. This
  matches exactly how the live Webflow form works (no form GUID, no backend).
- **Fields** (names mirror Webflow `[V3] Contact Short Form`): `Name`, `Email`, `Company`, `Tell-Us`,
  `Meet-Selected-Day`, `Time-Zone`, `Meet-Selected-Hour`; honeypot `work-email-2`.
- **AC1/AC2:** one contact created/updated, deduped by email in HubSpot; attribution via the `hubspotutk`
  cookie the tracking script sets. **Persona signal is not yet captured** (no persona field — open).
- **AC3:** inline accessible errors (`role="alert"`, focus moved to the first invalid field) before submit.
- Built in `apps/marketing/src/pages/contact.astro` + `src/layouts/Base.astro`.

## Notes / human gates
- ✅ Exact fields resolved (mirror Webflow, above). Routing/owner in HubSpot → Sales.
- Capture relies on the async tracking script; consider upgrading to the **Forms Submission API** for a
  server-acknowledged success + validation (a hardening of this story).
- Verify a real submission lands in HubSpot after deploy (then set `last_validated`).
