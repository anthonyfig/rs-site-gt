---
id: gt-03-us-home-persona-paths-cta
title: "US-3 — Persona paths & primary CTA"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested) + Head of Sales"
status: draft
confidence: medium
sources: ["Capability gt-03-capability-home-positioning", "gt-01-audience-and-icp (personas A/B/C)", "gt-03-capability-lead-capture"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-home-positioning
related: ["gt-03-capability-home-positioning", "gt-01-audience-and-icp", "gt-03-capability-lead-capture"]
tags: ["home", "personas", "cta", "conversion"]
---

# User story: Persona paths & primary CTA

**As a** visitor (persona A/B/C) **I want** a path matching my situation and a clear primary CTA
**so that** I can take the next step — an AI Discovery Sprint.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|
| Visitor (anon) | Pick a persona path; click the CTA | — |

## Preconditions
- The three personas (Scaling Tech Exec, Mission-Driven Innovator, Non-Technical Visionary) are modeled (`01/audience-and-icp`).

## Acceptance criteria — scenarios
**Scenario: Persona-aware entry**
- **Given** the three personas
- **When** I scan the page
- **Then** I find an entry point that matches "I have a team and a roadmap," "I have a high-stakes launch," or "I have a vision but no team."

**Scenario: Primary CTA → Discovery Sprint**
- **Given** the primary CTA ("Start an AI Discovery Sprint")
- **When** I click it
- **Then** I enter the lead-capture flow (`gt-03-capability-lead-capture`) — HubSpot contact + optional direct booking + Slack notify.

## Definition of done
- [ ] Scenarios pass · CTA reliably reaches lead capture · WCAG AA · no placeholder.

## Evals
| Scenario | Eval | Pass condition |
|----------|------|----------------|
| CTA → lead | `EV-LEAD-HAPPY` | reaches lead capture; HubSpot contact created |
| A11y | `EV-A11Y` | no blocking violations |
| Server-rendered | `EV-SEO-REGRESSION` | paths present in initial HTML |

## Notes / human gates
- Qualification fields/routing per persona → Sales (BR-9 liquidity check for persona C).
