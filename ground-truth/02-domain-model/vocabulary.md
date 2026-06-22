---
id: gt-02-vocabulary
title: "Vocabulary & Term Mapping"
part: "02-domain-model"
type: vocabulary
owner: "Head of Marketing + Product Architect"
status: draft
confidence: high
sources:
  - "Delivery v2 deck — /sources/ai-native-delivery.html (A1 mapping + definitions, Jun 2026)"
  - "Notion: AI Delivery Playbook v1.0 (CC/CD, Agency Ladder) (Dec 2025)"
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["marketing-site", "explorer"]
related: ["gt-02-entities", "gt-07-0001-adopt-ground-truth-blueprint"]
tags: ["glossary", "messaging"]
---

# Vocabulary & Term Mapping

The site must teach a new vocabulary while retiring an old one. Consistency here is a messaging
requirement, not just documentation.

## Core terms (the new language)

- **Ground Truth** — a precise, living, *validated* model of how a business actually works
  (processes, rules, data, integrations, decisions). The durable asset; software is derived from it.
- **Capability** — a **unit of value** (a business function), as opposed to a story, which is a
  unit of *work*. Sized C1–C5 (see business rules). What clients buy.
- **Business Twin** — the navigable, queryable representation of the Ground Truth (successor to a
  "story map"); surfaced via the **Ground Truth Explorer**.
- **AI Delivery System** — the engineering machinery that turns Ground Truth + specs into working
  software reliably: agents, evals, orchestration, guardrails, memory, tool contracts,
  observability, design standards.
- **Loop** — a closed, reusable delivery cycle (spec → act → independently verify → follow-up →
  repeat until done). The new unit of delivery.
- **Eval** — an automated check of *behaviour* ("does the system do the right thing?"), beyond
  "does the code run?". Keeps checking as agents change code.
- **Human gate** — a point where an agent surfaces a decision (ambiguity, risk, business judgment)
  to a human instead of guessing.
- **Continuous Calibration / Continuous Development (CC/CD)** — the AI-delivery loop from the
  Playbook: build capability ↔ tune behaviour against a reference dataset.
- **Agency Ladder (L1–L3)** — autonomy levels: **L1 Copilot** (AI suggests, human acts),
  **L2 Agentic** (AI acts, human reviews), **L3 Autonomous** (AI acts, human audits).

## Old → New (every artifact has a successor)
*Source: Delivery v2 deck, appendix A1.*

| Was | Now |
|-----|-----|
| Workshops | Interviews & knowledge extraction |
| User stories | Capabilities |
| Story map | Business Twin |
| Diagrams | Graph |
| Documentation | Navigable system |
| Developers | Capability delivery system |
| Sprints | Model iterations |
| Backlog | Ground Truth |
| Tickets | Capabilities |
| Software | Business Capability |

## "Dead" terms — do not lead with these
The deck explicitly retires the vocabulary built to ration engineering capacity:
**Scrum · Agile · Sprints · Backlog · Story points · Velocity.**

> Nuance for the site: these terms are *dead as the selling frame*, not necessarily as internal
> mechanics. The deck also says existing T&M engagements keep their Jira/backlog/sprints. So:
> retire them from **positioning**; don't claim Rootstrap has abolished all process. (See OQ-4.)

## Terms to use with care
- **"Fixed-bid"** — true for *validated capabilities*, not open-ended AI autonomy. See Decision `0003`.
- **"Autonomous"** — map to the Agency Ladder; most client value today is L1–L2 with human gates.
