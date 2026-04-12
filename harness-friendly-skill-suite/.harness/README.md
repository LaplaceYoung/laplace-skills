# .harness Runtime Core

This directory is the canonical runtime core for the harness-friendly project.

## Purpose
Like OMX's `.omx`, this directory stores machine-oriented workflow state and structured artifacts so a coding agent can:
- resume safely
- hand off between phases
- inspect prior decisions
- avoid relying on hidden chat memory

## Key areas
- `context/` — run/task context snapshots
- `specs/` — execution specs
- `plans/` — adaptation or loop plans
- `state/` — current loop state
- `artifacts/` — structured phase outputs
- `runs/` — per-run summaries
- `logs/` — runtime logs
- `checkpoints/` — resumability snapshots
