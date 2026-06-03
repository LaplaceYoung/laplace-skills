---
name: dynamic-code-review
description: Use when the user asks for a deep code review, adversarial review, multi-agent review, risk-ranked review, PR review, security-sensitive review, or implementation verification with concrete file and line evidence.
metadata:
  short-description: Adversarial code review workflow
---

# Dynamic Code Review

Use this skill for rigorous code review with explicit evidence and independent challenge.

## Review Contract

Start by identifying:
- review scope
- intended behavior
- changed files
- critical risk areas
- available tests
- expected output format

Findings lead the response. Order them by severity and include file and line references.

## Workflow

1. Map the changed surface and nearby dependencies.
2. Identify correctness, security, data, concurrency, API contract, and test risks.
3. Use `explore` for independent codebase lookup when subagent review is requested.
4. Use `critic` for adversarial challenge when subagent review is requested.
5. Verify findings against source lines and executable evidence where practical.
6. Report only actionable findings with concrete reproduction or reasoning.

## Severity

- P0: data loss, security breach, production outage, broken core path
- P1: likely user-visible regression, broken API contract, missing critical validation
- P2: meaningful edge-case bug, weak test coverage around changed behavior
- P3: maintainability issue with clear future cost

## Output

Return:
- findings first
- open questions
- test gaps
- brief change summary only when useful

For each finding include:
- severity
- file and line
- impact
- fix direction
- evidence
