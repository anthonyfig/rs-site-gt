---
id: gt-07-0011-separate-repos-ground-truth-vs-website
title: "0011 — Separate repositories: Ground Truth (content) vs website code"
part: "07-decision-log"
type: decision
owner: "Anthony (sponsor) + Platform Architect"
status: approved
confidence: high
sources: ["User question (Jun 2026): different repositories for ground-truth vs website?", "User decision (Jun 2026): created rs-site-gt + rs-ip; prefers separate repos over submodules; SSH remotes"]
updated: 2026-06-22
last_validated: "2026-06-22"
validated_by: "Anthony (in-session)"
applies_to: ["ground-truth", "explorer", "marketing-site"]
related: ["gt-07-0010-git-system-of-record-db-engine", "gt-04-stack-and-architecture"]
tags: ["adr", "architecture", "repos", "reuse"]
---

# 0011 — Separate repos: Ground Truth vs website code

**Status:** Accepted — **separate repos, not submodules** (user preference) · **Date:** 2026-06-22

**Repos (SSH remotes):** `git@github.com:anthonyfig/rs-site-gt.git` (Ground Truth content) ·
`git@github.com:anthonyfig/rs-ip.git` (reusable method/IP) · `git@github.com:anthonyfig/rs-site.git` (website code).

## Context
Decision 0010 makes Git the system of record for the Ground Truth, with the Explorer committing to
it on users' behalf. The website code is engineer/agent-authored on a different cadence. And the
Blueprint is meant to be **reused on every project** — so the *method* and the *content* have
different lifecycles, audiences, and access needs.

## Decision (recommended)
Three repositories, by lifecycle:
1. **Ground Truth repo (per project)** — the GT *content* (the 7 parts, capabilities, user stories,
   decisions, media refs). Git = its system of record; the Explorer is its Git-backed UI. Own access
   control (internal-only data, BR-8) and own history (Explorer/agent content-commits).
2. **Website code repo (`rs-site`)** — Astro marketing site + the Explorer app instance + packages.
   **Consumes** the Ground Truth repo (git submodule, published package, or CI checkout/sync).
3. **Reusable method/IP repo (later)** — blueprint templates, metadata schema, checker tooling,
   agents/skills, and the **Explorer app** itself. Rootstrap's compounding IP across clients.

## Why
- **Clean histories** — content-commits from the Explorer don't pollute code history, and vice versa.
- **Access control** — GT holds business-confidential truth; separate boundary from the code.
- **Reuse** — models the "per-project Ground Truth + reusable method" pattern the thesis depends on;
  a client's GT can't cross confidentiality walls, but the method/app travels.

## Pilot note / consequences
- **Separate repos, not submodules** (per preference). `rs-site-gt` is **self-contained** — the
  Ground Truth content **plus** the checker/navigator that operate on it — so it runs with zero
  cross-repo wiring. `rs-site` consumes the GT repo at build; `rs-ip` holds the cross-project
  agents/skills + the Explorer app (templates/tooling promoted here as we generalize).
- Site CI rebuilds the DB index from the GT repo; the marketing build pulls the GT repo at build.
- Alternative (rejected for the long term, OK for a quick pilot): a single monorepo — simpler now,
  but mixes the two lifecycles and doesn't teach the reuse pattern.
