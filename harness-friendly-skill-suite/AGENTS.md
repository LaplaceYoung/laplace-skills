# AGENTS.md

## Purpose
This repository is a harness-friendly project for Codex-style agents. It is organized so an agent can run a low-risk, artifact-first loop and leave structured state behind.

## Start here
1. Read `README.md`
2. Read `docs/harness-suite/governance.md`
3. Read `docs/harness-suite/runbook.md`
4. Read `scripts/README.md`
5. Inspect `.harness/README.md`

## Canonical runtime root
Use `.harness/` as the machine-facing runtime core.

### Write here
- context snapshots -> `.harness/context/`
- loop/adaptation plans -> `.harness/plans/`
- loop state -> `.harness/state/`
- scanner/evaluator outputs -> `.harness/artifacts/`
- run summaries -> `.harness/runs/`

### Human-facing output
- concise summaries and diff-style reports -> `reports/`

## Safety rules
- Do not modify core code without explicit approval.
- Prefer dry-run analysis first.
- Treat runtime-coupled files as protected until proven safe.
- Keep reports concise and auditable.

## Preferred command
```bash
python scripts/harness_loop.py --repo .
```
