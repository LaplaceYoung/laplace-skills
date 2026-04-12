# Naming Policy Template

## Goals
- maximize agent readability
- reduce ambiguous filenames
- preserve runtime safety

## Default filename style
- lowercase kebab-case for Markdown and docs
- descriptive multi-word names over vague names like `misc`, `temp`, `new`, `draft2`
- prefix optional category when useful, e.g. `plugin-`, `skill-`, `report-`, `spec-`

## File-type rules
- `*.md` -> descriptive kebab-case
- docs indexes -> `index.md`, `project-map.md`, `runbook.md`, `governance.md`
- reports -> `change-trace-YYYY-MM-DD.md`
- plans -> `adaptation-plan-YYYY-MM-DD.md`
- specs -> `<topic>-spec.md`

## Risk gates
Never rename without approval when a file is referenced by imports, routing, build config, deployment config, or external integrations.
