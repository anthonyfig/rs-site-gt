---
id: gt-03-us-insights-migrate-webflow
title: "INSIGHT-3 · Migrate the Webflow blog"
part: "03-capability-specs"
type: user-story
owner: "Head of Marketing (suggested) + Platform Architect"
status: draft
delivery_status: backlog
confidence: medium
sources: ["Capability gt-03-capability-insights", "live: rootstrap.com/blog (Webflow CMS)", "gt-02-content-types (Insight/Post)", "Decision 0006 (exit Webflow)"]
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
capability: gt-03-capability-insights
related: ["gt-03-capability-insights", "gt-02-content-types", "gt-04-seo-and-llm-discovery"]
tags: ["migration", "webflow", "blog", "seo"]
---

# User story: Migrate the Webflow blog

> Important: the **entire existing Webflow blog must be imported/migrated** into the new
> stack as `Insight/Post` content (`02/content-types`), with SEO preserved.

**As a** marketing editor **I want** the existing Webflow blog migrated into the Ground Truth / CMS
**so that** all posts move to the new site without losing content or rankings.

## Acceptance criteria — scenarios
**Scenario (US-insights-migrate-AC1): Import every post**
- **Given** the Webflow blog (CMS export / API)
- **When** migration runs
- **Then** every post imports as an `Insight/Post` (title, author, date, body, tags, media) — **none dropped**; a count reconciles source vs. imported.

**Scenario (US-insights-migrate-AC2): SEO preserved**
- **Then** canonical URLs are preserved or **301-redirected**, and structured data is intact — no ranking regression (the `EV-SEO-REGRESSION` gate).

**Scenario (US-insights-migrate-AC3): Media migrated**
- **Then** post images/assets move to object storage and are referenced (not hot-linked from Webflow).

## Definition of done
- [ ] All scenarios pass · source↔imported count reconciles · redirects verified · no placeholder.

## Evals
| AC | Eval | Pass condition |
|----|------|----------------|
| AC1 | migration-completeness check | imported count == source count |
| AC2 | `EV-SEO-REGRESSION` | URLs/redirects + structured data preserved |
| AC3 | `EV-NO-PLACEHOLDER` | media resolved, none missing |

## Notes / human gates
- Source = Webflow CMS export or API; confirm access. One-time migration + ongoing publishing thereafter.
