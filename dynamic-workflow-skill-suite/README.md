# dynamic-workflow-skill-suite

A Codex-oriented skill suite for building task-specific execution harnesses.

This pack adapts the dynamic workflow idea into reusable Codex skills: define a workflow shape, split independent work, keep verification explicit, and stop only when the success condition is met.

## What this pack is for

Use this pack when a task benefits from structure beyond a single linear agent pass:

- complex repository analysis
- adversarial code review
- root-cause debugging loops
- source-backed technical research
- architecture or strategy option selection
- multi-agent fan-out and synthesis

## Skills

| Skill | Purpose | Primary workflow |
| --- | --- | --- |
| [`dynamic-workflow`](./skills/dynamic-workflow) | General task-specific harness selection | classify-and-act, fan-out, generate-and-filter, tournament, loop |
| [`dynamic-code-review`](./skills/dynamic-code-review) | Evidence-based adversarial code review | adversarial verification |
| [`dynamic-debug`](./skills/dynamic-debug) | Reproduce, isolate, fix, verify, and prevent recurrence | loop-until-done |
| [`dynamic-research`](./skills/dynamic-research) | Primary-source research and ranked synthesis | fan-out-and-synthesize |

## Core ideas

- **Success criteria first**: every workflow starts by defining the target outcome and stop condition.
- **Workflow shape before execution**: select classify, fan-out, adversarial verification, generate-filter, tournament, or loop based on task risk.
- **Main-thread ownership**: the main agent owns integration, risk decisions, and final verification.
- **Independent subagents**: subagents handle bounded, independent side work when the user requests multi-agent or parallel execution.
- **Evidence over confidence**: final claims need command output, source links, file references, or explicit residual-risk notes.

## Quick start

```text
Use $dynamic-workflow to analyze this repository with fan-out-and-synthesize, then return ranked risks and evidence.
```

```text
Use $dynamic-code-review to review this PR with adversarial verification and file-line findings.
```

```text
Use $dynamic-debug to fix this failing test with loop-until-done. Success condition: the targeted test passes.
```

```text
Use $dynamic-research to compare these SDK options using primary sources and a ranked recommendation.
```

## Repository layout

```text
dynamic-workflow-skill-suite/
├─ skills/
│  ├─ dynamic-workflow/
│  ├─ dynamic-code-review/
│  ├─ dynamic-debug/
│  └─ dynamic-research/
└─ README.md
```

## Status

Current status: **Active v0.1**

Implemented:
- 4 reusable Codex skills
- UI metadata via `agents/openai.yaml`
- workflow routing guidance
- completion-report contracts

Future work:
- example transcripts
- evaluation prompts
- task-specific rubrics for migration, security, and architecture reviews

## Source

Original skill suite inspired by dynamic workflow and task-harness patterns used in modern agent workflows.
