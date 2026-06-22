# CLAUDE.md — Operating guide for this repository

This file governs how Claude (and any agent) works in the Rootstrap Website repo. It merges
with the user's global engineering guidelines (think before coding, simplicity first, surgical
changes, goal-driven execution). When in doubt, those still apply.

## The one rule everything else serves

**Ground Truth is the single source of truth.** The software is *derived* from
[`ground-truth/`](ground-truth/README.md). Code must not contradict an `approved` Ground Truth
artifact. If reality and the code disagree, the Ground Truth wins — or the Ground Truth is wrong
and must be corrected *first*, through the review queue, before code changes.

Flow: **Knowledge → Ground Truth → Specs → Agents → Software.**

## What this means in practice

1. **Read Ground Truth before acting.** Before implementing anything, load the relevant
   `applies_to` artifacts. Build production code only from `status: approved` artifacts.
2. **Respect status.** Building from `draft`/`in-review` is allowed only for a spike, and only
   if you *explicitly flag* the dependency and route it to a human. Never silently build on
   unvalidated truth.
3. **Surface decisions; don't invent them.** If the Ground Truth is ambiguous, conflicting, or
   missing (`confidence: low`), **stop and raise a human gate** — do not guess business reality.
   Emit a short "Decision needed" with the options, who's affected, and your confidence. (See the
   Human Gates pattern in the Delivery v2 deck.)
4. **Independent verification.** An agent never verifies its own work. QA/eval is a separate
   step (separate agent or eval suite). Every loop has stop conditions, an owner, and an escape.
5. **Keep changes surgical.** Every changed line traces to a request or a Ground Truth artifact.
6. **Update the Ground Truth when you learn something.** New truth → propose a change (new/edited
   artifact with metadata) → review queue → status update. Record material decisions in
   `07-decision-log/`.

## Editing Ground Truth

- **Git is the system of record** for the Ground Truth text (agent-native markdown); **media** in object storage; the **database is a read/query index rebuilt from Git**; the **Explorer commits to Git behind a UI** (Decisions 0009/0010). No developer hand-commits of Ground Truth.
- Every artifact needs the full metadata block ([`_schema/metadata-schema.md`](ground-truth/_schema/metadata-schema.md)).
- Changing a source that backs an `approved` artifact flips it to `needs-revalidation`.
- New capability? Copy [`_schema/templates/capability-spec.template.md`](ground-truth/_schema/templates/capability-spec.template.md).
- Material decision? Add a numbered entry to `07-decision-log/`.

## Engineering conventions

The authoritative engineering context lives in
[`ground-truth/04-engineering-context/`](ground-truth/04-engineering-context/_index.md)
(stack, architecture, SEO + LLM discovery, conventions). Highlights:

- **Stack:** React 19 + TypeScript + Vite + Tailwind + shadcn/ui (Radix) + TanStack Query +
  Supabase for the **Explorer app**; **Astro** for the **public marketing site** (SEO + LLM
  discoverability). See Decision Log `0002`.
- TypeScript strict. Components small and composable. No speculative abstraction.
- Accessibility (WCAG) and Core Web Vitals are acceptance criteria, not afterthoughts.

## Reusable delivery loops (the AI Delivery System)

We build delivery as closed loops (spec → act → independently verify → create follow-up →
repeat until done), not one-off prompting. Loop types we expect to reuse: QA/Playwright, bug
triage, spec-consistency, **Ground-Truth-consistency**, regression, integration-contract,
security review. Each has an owner, stop conditions, logs, and a human escalation path.

## Tone for stakeholder-facing output

This is a credibility project: the site *is* the argument for the method. Be precise, avoid
hype, show the mechanism. No Lorem Ipsum, ever — if content is unknown, mark it an open question
in the Ground Truth.
