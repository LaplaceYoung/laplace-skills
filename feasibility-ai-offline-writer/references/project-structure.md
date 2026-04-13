# Project Structure

Recovered FeasibilityAI project layout:

```text
project/
  project.json
  outline.json
  storm.json                # Storm mode only
  scheme.json
  scheme.snapshots.json
  content/
    <uuid>.md
  assets/
    images/
    references/
  reviews/
    index.json
    data/
      <reportId>.json
  .feasibility.lock
```

## Notes

- `project.json` stores version, id, timestamps, project_mode, document_stage, linked_projects, info, settings.
- `outline.json` stores the chapter tree.
- `content/<uuid>.md` stores chapter markdown bodies.
- `scheme.json` and `scheme.snapshots.json` store structured scheme-building state.
- `reviews/` stores QA reports and summaries.
- `.feasibility.lock` is used for single-project locking across windows/processes.
