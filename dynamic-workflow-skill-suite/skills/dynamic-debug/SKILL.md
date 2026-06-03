---
name: dynamic-debug
description: Use when the user asks to debug a failing test, runtime error, regression, flaky behavior, production-like failure, root-cause analysis, or loop-until-done repair workflow.
metadata:
  short-description: Root-cause debugging workflow
---

# Dynamic Debug

Use this skill for root-cause debugging with tight diagnostic loops.

## Debug Contract

Before editing, identify:
- observed failure
- expected behavior
- reproduction command
- smallest failing scope
- likely ownership area
- stop condition

Bug closure requires root cause, fix, verification, and recurrence prevention.

## Workflow

1. Reproduce or inspect the freshest failure evidence.
2. Isolate the failing boundary with the smallest useful command.
3. Form one primary hypothesis and one fallback hypothesis.
4. Inspect the relevant code path.
5. Apply the smallest fix.
6. Verify with the targeted command.
7. Add a regression test, minimal reproduction, validation script, or explicit verification notes.
8. Repeat until the stop condition is met or a hard blocker is identified.

## Subagent Use

When the user requests multi-agent debugging:
- Use `explore` for independent code path mapping.
- Use `debugger` for root-cause challenge.
- Use `test-engineer` for regression coverage shape.
- Keep edits local to the main thread unless a worker has a clearly disjoint write scope.

## Output

Return:
- root cause
- fix summary
- verification evidence
- recurrence prevention
- remaining risk
