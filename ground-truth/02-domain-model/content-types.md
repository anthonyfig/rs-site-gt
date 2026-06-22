---
id: gt-02-content-types
title: "Content Types"
part: "02-domain-model"
type: domain-entity
owner: "Head of Marketing + Product Architect"
status: draft
confidence: medium
sources:
  - "Decision 0012 (capability vs content)"
  - "live: rootstrap.com IA; rootstrapedia (industries, projects)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site"]
related: ["gt-02-entities", "gt-03-capability-content-publishing", "gt-07-0012-capability-vs-content-definition"]
tags: ["content", "content-types", "model"]
---

# Content Types

> The **content** the capabilities operate on (Decision 0012). Pages and collections are content —
> **not** capabilities. A specific page is a content *instance*; its behaviour (if any) is a *user
> story* under a content capability.

## Page (single marketing page)
**Instances:** Home · About · How we work · AI offering · Careers.
Fields: slug, title, sections, SEO meta, structured-data type. The *content/intent* is sourced from
Part 01 (positioning, audience) and Part 02 entities (offering, proof points) — not duplicated here.
**Presented by:** Content Management & Publishing.

## Collection (index + filter + detail)
A set of items with a browsable index and detail pages.
**Instances:** Industries · Case Studies · Insights/Posts.
**Presented by:** Content Management & Publishing / Case Studies & Portfolio / Insights & Blog.

## Industry *(collection item)*
Fields: name, why-Rootstrap, regulatory notes (regulated-AI trust, BR-13), representative proof.
*(Formerly mis-modeled as a capability — it is content.)*

## Case Study *(collection item)*
Fields: client, problem, approach, outcome, metrics, media, persona-fit, `shareable?`.
Lead six (OQ-5): MasterClass · The Farmer's Dog · Madison Reed · Emeritus · BetterUp · Door Space.

## Insight / Post *(collection item)*
Fields: title, author, date, topic, body, canonical-url, structured-data. **The Webflow blog
migrates into this type** (see Insights & Blog capability).

## Service / Offering *(content)*
The AI-native offering pillars + delivery models (June 2026 Overview). Data in `entities.md`;
*presented* by Content Management & Publishing.

## Media Asset *(content)*
Images / video / documents, incl. design-system assets (logos, shapes). See `entities.md` + Decision 0008.

> **Rule:** a new page/item is **content** → an instance of one of these types, presented by an
> existing capability. Only add a Part-03 capability when a new *function* appears (see the litmus in
> rs-ip `docs/identifying-capabilities.md`).
