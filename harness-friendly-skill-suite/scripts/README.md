# Scripts

## dry_run_rename_scanner.py
Creates a dry-run rename plan:
- Canonical JSON: `.harness/artifacts/rename-plan.json`
- Canonical Markdown: `.harness/artifacts/rename-plan.md`
- Human-facing copies are written to `reports/` by `harness_loop.py`

Usage:
```bash
python scripts/dry_run_rename_scanner.py --repo .
```

## harness_evaluator.py
Scores harness friendliness:
- Canonical JSON: `.harness/artifacts/harness-evaluator.json`
- Canonical Markdown: `.harness/artifacts/harness-evaluator.md`
- Human-facing copies are written to `reports/` by `harness_loop.py`

Usage:
```bash
python scripts/harness_evaluator.py --repo .
```

## harness_loop.py
Runs the canonical loop:
- writes context to `.harness/context/`
- writes plans to `.harness/plans/`
- writes state to `.harness/state/`
- writes repo inventory to `.harness/artifacts/repo-inventory.*`
- writes protected-area classification to `.harness/artifacts/protected-areas.*`
- writes adaptation / rename / executor / evaluator / delta artifacts to `.harness/artifacts/`
- writes checkpoints to `.harness/checkpoints/`
- copies human-facing reports into `reports/`

Usage:
```bash
python scripts/harness_loop.py --repo .
python scripts/harness_loop.py --repo . --resume
python scripts/harness_loop.py --repo . --apply-low-risk
```

## repo_inventory.py
Generates canonical inventory artifacts:
- `.harness/artifacts/repo-inventory.json`
- `.harness/artifacts/repo-inventory.md`

## protected_areas.py
Generates protected-area classification artifacts:
- `.harness/artifacts/protected-areas.json`
- `.harness/artifacts/protected-areas.md`

## adaptation_plan.py
Generates a canonical adaptation plan from prior artifacts:
- `.harness/artifacts/adaptation-plan.json`
- `.harness/artifacts/adaptation-plan.md`

## low_risk_executor.py
Plans or applies only low-risk adaptation actions:
- `.harness/artifacts/low-risk-executor.json`
- `.harness/artifacts/low-risk-executor.md`

## delta_evaluator.py
Compares current evaluator output to the previous saved evaluator artifact:
- `.harness/artifacts/delta-evaluator.json`
- `.harness/artifacts/delta-evaluator.md`
