---
name: dynamic-workflow
description: Use when the user asks for a dynamic workflow, multi-agent workflow, task-specific harness, complex task orchestration, fan-out synthesis, adversarial verification, generate-and-filter exploration, tournament-style solution search, or loop-until-done execution in Codex.
metadata:
  short-description: Dynamic task harness for Codex
---

# Dynamic Workflow

Use this skill for complex tasks that benefit from a temporary task-specific execution harness.

## Core Contract

Before execution, define:
- target outcome
- success criteria
- constraints
- workflow shape
- verification evidence
- stop condition

Keep the main thread responsible for integration, risk decisions, and final verification.

## Workflow Shapes

### Classify And Act

Use for mixed queues, issue lists, review comments, inboxes, and task triage.

Steps:
1. Classify each item by type, risk, owner, and required evidence.
2. Route simple items to direct execution.
3. Route codebase lookup to `explore`.
4. Route implementation to `executor`.
5. Route final claim checks to `verifier`.

### Fan Out And Synthesize

Use for repo mapping, migration scoping, backlog analysis, research, and large comparison tasks.

Steps:
1. Split the task into independent questions.
2. Assign only independent sidecar work to subagents when the user requested multi-agent or parallel work.
3. Continue local integration while sidecar work runs.
4. Synthesize findings into ranked actions.
5. Verify the highest-value conclusion with direct evidence.

### Adversarial Verification

Use for security-sensitive work, code review, architectural claims, data handling, auth, billing, migrations, and bug-fix closure.

Steps:
1. State the claim being verified.
2. Define a rubric before judging.
3. Ask `critic` or `verifier` for an independent attack when subagent use is authorized.
4. Fix issues found.
5. Report evidence and residual risk.

### Generate And Filter

Use for architecture options, UX direction, naming, migration strategy, prompt variants, and technical design alternatives.

Steps:
1. Generate 3-5 candidate approaches.
2. Define a scoring rubric before selection.
3. Score each candidate against the rubric.
4. Select one path.
5. Execute or produce a decision record.

### Tournament

Use for high-value design, algorithm, architecture, or prompt choices.

Steps:
1. Create several candidate strategies.
2. Evaluate each with the same rubric.
3. Advance the strongest candidate.
4. Run a final critic/verifier pass when authorized.
5. Record the selected strategy and rejected alternatives.

### Loop Until Done

Use for failing tests, repeated build errors, flaky bugs, cleanup loops, and diagnostic repair tasks.

Steps:
1. Define the stop condition.
2. Run the smallest useful diagnostic.
3. Apply the smallest fix.
4. Verify.
5. Repeat until the stop condition is met or a hard blocker is identified.

## Subagent Routing

Use subagents only when the user explicitly asks for subagents, delegation, parallel agents, or a multi-agent workflow.

Recommended roles:
- `explore`: repository search, file mapping, symbol lookup
- `researcher`: external official documentation and source-backed references
- `dependency-expert`: package or SDK evaluation
- `executor`: scoped implementation
- `critic`: plan, design, and claim challenge
- `verifier`: completion evidence and test adequacy
- `test-engineer`: test strategy and regression coverage
- `writer`: documentation and migration notes

Delegated tasks must be independent, bounded, and useful to the main thread. The main thread owns final integration and verification.

## Completion Report

Return:
- workflow shape used
- actions taken
- evidence gathered
- result
- remaining risks
- concrete next step when action remains
