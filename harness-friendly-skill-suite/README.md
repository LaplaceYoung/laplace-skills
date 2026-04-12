# harness-friendly-skill-suite

A harness-first skill suite for adapting repositories into an **AI-agent-friendly** architecture.

This project is designed for Codex-style agent workflows: it organizes repository understanding, safety boundaries, low-risk adaptation, and traceable run artifacts into a single loop.

## What this repo is for

`laplace-skills` helps turn a repository into a shape that agents can work with more reliably:
- clearer entrypoints
- clearer safe vs protected areas
- structured phase artifacts instead of hidden chat context
- resumable loop execution
- low-risk adaptation before high-risk code changes
- human-readable reports for review and rollback decisions

## Core ideas

This project follows the harness-engineering direction emphasized by OpenAI, Anthropic, and the operational style of OMX:
- **artifact-first**: each phase writes canonical outputs
- **stateful**: loop state lives in a dedicated runtime root
- **resume-safe**: runs can continue from checkpoints
- **low-risk by default**: no core-code modification unless explicitly allowed
- **human-auditable**: reports are copied into a reviewer-friendly layer

## Runtime model

This repository uses `.harness/` as the canonical runtime core.

### Machine-facing runtime root
- `.harness/context/` — run context snapshots
- `.harness/plans/` — loop plans
- `.harness/state/` — current loop state
- `.harness/artifacts/` — canonical generated artifacts
- `.harness/checkpoints/` — resumability checkpoints
- `.harness/runs/` — run summaries
- `.harness/logs/` — future runtime logs

### Human-facing output
- `reports/` — copied summaries and diff-style review artifacts

By repository convention, `.harness/` runtime outputs and `reports/` generated outputs are ignored from git, except for placeholders/templates needed to keep the structure visible.

## Current loop phases

The harness loop currently runs these phases:
1. `discover`
2. `classify`
3. `plan`
4. `simulate`
5. `adapt`
6. `evaluate`
7. `summarize`

## Current capabilities

### Analysis / planning
- repo inventory generation
- protected-areas classification
- adaptation-plan generation
- dry-run rename planning

### Execution / evaluation
- low-risk executor (dry-run by default)
- harness evaluator
- delta evaluator (current vs previous run)
- checkpoint-based resume support

## Scripts

- `scripts/repo_inventory.py`
- `scripts/protected_areas.py`
- `scripts/adaptation_plan.py`
- `scripts/dry_run_rename_scanner.py`
- `scripts/low_risk_executor.py`
- `scripts/harness_evaluator.py`
- `scripts/delta_evaluator.py`
- `scripts/harness_loop.py`

See also: `scripts/README.md`

## Quick start

### 1. Run the loop in dry-run mode
```bash
python scripts/harness_loop.py --repo .
```

### 2. Resume from the current checkpoint/state
```bash
python scripts/harness_loop.py --repo . --resume
```

### 3. Allow low-risk adaptation actions
```bash
python scripts/harness_loop.py --repo . --apply-low-risk
```

## Repository layout

```text
skills/                  skill definitions
scripts/                 loop helpers and executors
docs/harness-suite/      architecture, runbook, governance, research
templates/               reusable markdown templates
plugins/                 plugin-facing area
examples/                future brownfield / greenfield examples
.harness/                runtime core (ignored outputs + placeholders)
reports/                 human-facing generated outputs (ignored)
```

## Safety model

Default policy:
- do **not** modify core product/runtime logic
- do **not** rename import-sensitive or config-sensitive files
- do **not** touch runtime history/state roots without approval
- do prefer dry-run analysis first

Allowed by default:
- doc / report / template level analysis
- safe classification and planning
- low-risk executor in explicitly safe areas only

## Key docs

- `docs/harness-suite/architecture.md`
- `docs/harness-suite/runbook.md`
- `docs/harness-suite/governance.md`
- `docs/harness-suite/research-best-practices.md`
- `AGENTS.md`

## Status

Current status: **harness system v0.2**

Implemented:
- runtime core
- canonical artifacts
- checkpoints
- resume path
- delta evaluator
- low-risk executor

Still open for future work:
- stronger resume semantics from arbitrary checkpoints
- richer brownfield examples
- more capable low-risk auto-adaptation actions
- stronger before/after scoring and trend reporting

## License

Add a project license before broader distribution if needed.

