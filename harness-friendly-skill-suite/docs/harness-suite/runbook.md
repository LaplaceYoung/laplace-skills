# Runbook

## Brownfield flow
1. inventory repo contents
2. classify protected vs adaptable areas
3. write a structured adaptation plan before changing anything
4. run a dry-run rename scan for filename normalization by file type
5. evaluate proposed changes against explicit criteria
6. produce a concise change-trace report
7. stop before touching core code unless authorized

Canonical machine-facing outputs should be written under `.harness/`, while human-facing reports should be copied into `reports/`.

## Greenfield flow
1. scaffold harness-friendly layout
2. create entry docs and governance docs
3. create naming policy and protected-areas template
4. create adaptation-plan and change-trace templates
5. add skill/plugin placeholders only when useful
6. verify that a fresh agent can navigate the repo in a small number of hops

## Evaluator criteria
A run is better only if it improves explicit checks such as:
- entrypoints are obvious
- filenames are descriptive and non-ambiguous
- protected areas are listed
- approval-needed items are isolated
- final change trace is concise and complete

## Helper commands
- `python scripts/repo_inventory.py --repo .`
- `python scripts/protected_areas.py --repo .`
- `python scripts/adaptation_plan.py --repo .`
- `python scripts/dry_run_rename_scanner.py --repo .`
- `python scripts/low_risk_executor.py --repo .`
- `python scripts/harness_evaluator.py --repo .`
- `python scripts/delta_evaluator.py --repo .`
- `python scripts/harness_loop.py --repo .`
- `python scripts/harness_loop.py --repo . --resume`
- `python scripts/harness_loop.py --repo . --apply-low-risk`

## Safety rule
If a file is coupled to build, runtime, routing, imports, deployment, or external contracts, treat it as protected until explicitly cleared.
