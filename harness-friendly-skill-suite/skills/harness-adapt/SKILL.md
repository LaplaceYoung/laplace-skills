---
name: harness-adapt
description: Orchestrate harness-friendly repository adaptation in low-risk mode.
---

# Harness Adapt

## Purpose
Coordinate brownfield audit or greenfield scaffold work to make a repository easier for AI agents to understand without touching core code by default.

## Research-backed operating rules
- start with a single orchestrator and branch only for bounded subtasks
- require structured artifacts between phases
- use explicit evaluator criteria rather than vague notions of "better"
- apply layered guardrails and human approval for risky actions

## Required artifacts
1. repo inventory
2. protected areas list
3. adaptation plan
4. naming normalization plan
5. final change trace

## Canonical runtime root
Write machine-facing loop artifacts under `.harness/` whenever possible:
- context -> `.harness/context/`
- plans -> `.harness/plans/`
- state -> `.harness/state/`
- scanner/evaluator outputs -> `.harness/artifacts/`
- run summaries -> `.harness/runs/`

Copy concise human-facing summaries into `reports/`.

## Default sequence
1. classify repo as brownfield or greenfield
2. create repo inventory
3. mark protected areas
4. write adaptation plan
5. plan folder/doc/skill/plugin organization
6. plan filename normalization
7. run evaluator check against explicit criteria
8. emit concise change trace

## Delegation
- use `harness-brownfield-audit` for existing repos
- use `harness-greenfield-scaffold` for new repos
- use `harness-naming-normalizer` for rename planning
- use `harness-change-trace` for final report output

## Evaluator criteria
- a fresh agent can locate entrypoints quickly
- filenames are more descriptive and less ambiguous
- protected areas are explicit
- approval-needed items are isolated
- final report is sufficient for a human to retrace changes

## Helper commands
- `python scripts/repo_inventory.py --repo .`
- `python scripts/protected_areas.py --repo .`
- `python scripts/adaptation_plan.py --repo .`
- `python scripts/dry_run_rename_scanner.py --repo .`
- `python scripts/low_risk_executor.py --repo .`
- `python scripts/harness_evaluator.py --repo .`
- `python scripts/delta_evaluator.py --repo .`
- `python scripts/harness_loop.py --repo .`

## Stop conditions
Stop and request approval if the next action would:
- modify core product/runtime logic
- rename runtime-coupled files
- change imports, config, routing, or deployment behavior

## Non-goals
Do not refactor business logic or modify core runtime code unless explicitly authorized.
