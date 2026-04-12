# Harness-Friendly Architecture Notes

## Working definition
Harness-friendly architecture is a repository shape that helps an AI agent quickly answer:
- where do I start?
- which files are safe to edit?
- which docs define the rules?
- which folders map to runtime, docs, skills, plugins, and reports?
- what changed in the last adaptation run?
- what artifacts should I read before I act?

## Research-backed design principles
1. legibility before automation
2. single-agent first; split phases only when responsibilities are distinct
3. explicit structured artifacts between phases
4. layered guardrails and permissions
5. evaluator criteria must be explicit, not fuzzy
6. reversible organization changes
7. concise, mandatory run artifacts

## Minimal layers
- entrypoint layer: README, project map, runbook
- governance layer: protected areas, approval rules, non-goals
- adaptation layer: brownfield/greenfield workflows
- normalization layer: naming policy and rename plan
- evaluation layer: gradeable criteria for legibility/safety/traceability
- reporting layer: concise change-trace outputs

## Canonical artifacts
- `repo-inventory.md` or equivalent inventory artifact
- `protected-areas.md` or equivalent classification artifact
- `adaptation-plan.md` describing low-risk changes
- naming normalization plan
- final change trace

## Runtime core mapping
Inspired by OMX's `.omx/`, this project uses `.harness/` as the machine-facing runtime layer:
- `.harness/context/` — context snapshots
- `.harness/plans/` — loop/adaptation plans
- `.harness/state/` — resumable loop state
- `.harness/artifacts/` — canonical scanner/evaluator outputs
- `.harness/runs/` — run summaries
- `.harness/logs/` and `.harness/checkpoints/` — future observability/resume support

Human-facing summaries remain in `reports/`.
