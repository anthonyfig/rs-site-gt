---
id: gt-03-us-privacy-analytics
title: "US-1 — Privacy-respecting analytics"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested) + Platform Architect"
status: draft
confidence: medium
sources:
  - "Capability gt-03-capability-analytics-measurement"
  - "gt-01-constraints-and-success-metrics (message resonance, Explorer usage)"
  - "gt-05-hubspot (no PII in URLs; honor consent before non-essential tracking)"
  - "gt-04-seo-and-llm-discovery (AI-referral + organic traffic to measure)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-analytics-measurement
related: ["gt-03-capability-analytics-measurement", "gt-05-hubspot", "gt-01-constraints-and-success-metrics"]
tags: ["analytics", "privacy", "consent", "a11y"]
---

# User story: Privacy-respecting analytics

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

**As a** visitor **I want** my engagement measured without my personal data being tracked or leaked
**so that** Rootstrap can see what's working while my privacy is respected by default.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anonymous) | Browse with non-essential tracking **off**; opt in/out via consent UI | Be tracked by non-essential analytics before consent |
| Marketing/Growth analyst | Read aggregate page/engagement reports tied to `01` metrics | See PII or re-identify individuals from analytics |
| The system | Record privacy-safe, aggregate page/engagement signals after consent | Put PII in URLs/query strings; set non-essential cookies pre-consent |

## Preconditions
- Analytics is wired through GTM (`GTM-K48G3TB`); the cookie-light/privacy-preserving option is chosen on every config toggle.
- A consent mechanism exists and **defaults to declining non-essential** trackers.
- URLs use a clean, stable taxonomy (`04`) with **no personal data** in paths or query strings.

## Acceptance criteria — scenarios (Given / When / Then)
**Scenario (gt-03-us-privacy-analytics-AC1): Non-essential tracking is off until opt-in**
- **Given** a first-time visitor who has made no consent choice
- **When** the page loads
- **Then** only strictly-essential measurement runs; no non-essential cookies/trackers fire until the visitor opts in.

**Scenario (gt-03-us-privacy-analytics-AC2): Decline is the safe default**
- **Given** the consent UI is shown
- **When** the visitor ignores it or declines
- **Then** the most privacy-preserving state holds (non-essential tracking stays off) and the choice persists across pages.

**Scenario (gt-03-us-privacy-analytics-AC3): No PII in URLs or analytics payloads**
- **Given** any page view or engagement event
- **When** the event is recorded or forwarded
- **Then** no personal data (email, name, free-text) appears in URLs/query strings or the analytics payload; transport is secure.

**Scenario (gt-03-us-privacy-analytics-AC4): Engagement maps to a success metric**
- **Given** consent is granted
- **When** the visitor scrolls/engages on the positioning or the Explorer
- **Then** a privacy-safe, aggregate engagement signal is recorded that maps to the **message-resonance / Explorer-usage** metrics in `01`.

**Scenario (gt-03-us-privacy-analytics-AC5): Consent UI is accessible and cookie-light**
- **Given** the consent UI
- **When** a keyboard or screen-reader user reaches it
- **Then** it is fully operable, does not trap focus, does not block content, and the approach stays cookie-light (no non-essential cookies set by default).

## Definition of done
- [ ] All scenarios pass their evals · accessible (WCAG AA) · no PII in URLs (privacy rule) · no internal data (BR-8) · no placeholder content (BR-11)

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| AC1 | `EV-CONSENT-DEFAULT` | no non-essential tracker/cookie fires before opt-in |
| AC2 | `EV-CONSENT-DEFAULT` | decline/ignore → privacy-preserving state persists |
| AC3 | `EV-NO-PII-URL` | no PII in URL/query or analytics payload; secure transport |
| AC4 | `EV-METRIC-MAPPING` | engagement signal recorded + mapped to a `01` metric |
| AC5 | `EV-A11Y` | consent UI operable by keyboard/SR; no focus trap; cookie-light |

## Notes / human gates
- Exact consent/cookie approach and the analytics vendor (cookie-light tool vs. HubSpot-native) → Marketing + Platform Architect.
- Jurisdictional consent requirements (e.g., regional rules) → Marketing + legal; do not resolve alone.
