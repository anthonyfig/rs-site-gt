---
id: gt-03-us-content-capability-pages
title: "CONTENT-5 · Capability & technology pages"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested) + Platform Architect"
status: draft
delivery_status: shipped
confidence: medium
sources:
  - "Live capabilities mega-menu (AI/Data/Cloud + React/React Native/Node/Rails)"
  - "rootstrapedia: wiki/services (ai-ml, data, cloud), wiki/rootstrap.md capability pillars"
  - "Built: rs-site /capabilities/<slug> + 'capabilities' content collection"
updated: 2026-06-23
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-content-publishing
related: ["gt-03-capability-content-publishing", "gt-02-content-types", "gt-03-capability-case-study-showcase"]
tags: ["content", "capabilities", "technologies"]
---

# User story: Capability & technology pages

**As a** prospective client browsing the Capabilities menu **I want** a page for each capability (AI, Data, Cloud) and technology (React, React Native, Node.js, Ruby on Rails) **so that** I understand what Rootstrap does and can see related proof.

## Acceptance criteria — scenarios (Given / When / Then)
**Scenario (gt-03-us-content-capability-pages-AC1): A page per capability/technology**
- **Given** the `capabilities` content collection
- **When** I open `/capabilities/<slug>`
- **Then** I see the title, summary, "what we do" areas, the tech used, and related case studies — server-rendered, on-brand, accessible.

**Scenario (gt-03-us-content-capability-pages-AC2): Reachable from navigation**
- **Given** the Capabilities mega-menu (and the mobile menu)
- **When** I click a capability card or a technology link
- **Then** I land on the matching `/capabilities/<slug>` page — no dead links.

**Scenario (gt-03-us-content-capability-pages-AC3): Connected to proof**
- **Then** each page links to its **related case studies** (`/work/<slug>`), so capability → proof is one click.

## Definition of done
- [ ] All scenarios pass · accessible (WCAG AA) · no placeholder (BR-11) · no internal-only data (BR-8).

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | `EV-SEO-REGRESSION` / `EV-A11Y` | server-rendered, structured, accessible |
| AC2 | `EV-NAV` | every menu link resolves to a real page |
| AC3 | `EV-NO-PLACEHOLDER` | related-case links resolve |

## Notes / human gates
- Built: 7 pages (AI, Data, Cloud, React, React Native, Node.js, Ruby on Rails); pending validation/QA.
- Deeper per-capability sub-pages or a capabilities index → Marketing.
