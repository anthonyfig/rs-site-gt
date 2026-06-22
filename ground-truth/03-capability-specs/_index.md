---
id: gt-03-index
title: "Capability Specs — Index"
part: "03-capability-specs"
type: capability-spec
owner: "Product Architect (suggested)"
status: draft
confidence: medium
sources: ["Delivery v2 deck (capability hierarchy)", "Decision 0012 (capability vs content)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-03-capability-lead-capture", "gt-03-capability-content-publishing", "gt-07-0012-capability-vs-content-definition"]
tags: ["index", "capabilities"]
---

# 03 · Capability Specs

The website's **capabilities are the *functions* it performs** — not its pages. (Decision 0012; the
litmus test lives in rs-ip `docs/identifying-capabilities.md`.) Pages and collections are **content**
(`02/content-types`), *presented by* these capabilities. Each capability is a unit of value with
user stories (Given/When/Then) and evals.

## Capabilities (functions)
| Capability | Tier | Status | What it does |
|------------|------|--------|--------------|
| [Lead Capture & Qualification](capability-lead-capture.md) | C2 | worked · 3 stories | Capture → HubSpot → direct scheduling → Slack; the commercial point of the site |
| [Content Management & Publishing](content-publishing/capability.md) | C3 | worked · 4 stories | Render pages + the Industries collection from content; content ingest |
| [Case Studies & Portfolio](case-study-showcase/capability.md) | C2 | worked · 3 stories | Browse / filter / detail-with-media + materials ingest; lead six (OQ-5) |
| [Insights / Blog Publishing](insights/capability.md) | C2 | worked · 3 stories | Index + article + **migrate the Webflow blog** |
| [Navigation & Search](navigation-search/capability.md) | C2 | defined | Site IA + search across content, in plain language |
| [Discoverability (SEO + LLM/GEO)](discoverability/capability.md) | C2 | defined | Found + accurately cited by search engines and assistants (`04`) |
| [Ground Truth Explorer](ground-truth-explorer/capability.md) | C4 | defined | Internal: Ask / Browse / Trace / Validate / Generate / Ingest |
| [Analytics & Measurement](analytics-measurement/capability.md) | C1 | defined | HubSpot / GTM; the success metrics — privately |

## Content (not capabilities)
The site's pages and collections — **Home · About · How we work · AI offering · Careers · Industries
· Case Studies · Insights** — are **content** (`02/content-types`), presented by the capabilities
above. Their *intent* lives in Part 01 (positioning, audience) and Part 02 (offering, proof); their
*behaviour* is captured as user stories under **Content Management & Publishing** (and the
collection capabilities). A page is never a capability.

## Capability spec vs user story (Decision 0007)
- A **capability spec** is *human-facing* — the function / unit of value stakeholders validate.
- Its **user stories** are *agent-facing* — executable units with Given/When/Then acceptance criteria
  (stable AC ids) that map to evals. Many stories per capability.
- **Is it a capability or content?** Use the litmus in rs-ip `docs/identifying-capabilities.md`.
