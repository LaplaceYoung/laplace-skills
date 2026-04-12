---
name: harness-change-trace
description: Produce a concise Markdown record of repository adaptation changes.
---

# Change Trace

## Output sections
- summary
- artifacts read
- added
- renamed
- moved
- protected/skipped
- evaluator verdict
- approval-required recommendations

## Principle
The report should be brief, audit-friendly, and sufficient for a human or a later agent to retrace what happened and why.

## Required checks
- list the structured artifacts that informed the run
- distinguish applied changes from only-proposed changes
- preserve skipped/protected items explicitly
