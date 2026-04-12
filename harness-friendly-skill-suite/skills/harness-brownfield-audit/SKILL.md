---
name: harness-brownfield-audit
description: Audit an existing repository and propose low-risk harness-friendly adaptations.
---

# Brownfield Audit

## Inputs
- current repo contents
- user goal
- protected-area constraints

## Outputs
- repo inventory
- protected-areas list
- adaptation plan
- low-risk adaptation proposal
- safe rename candidates
- change-trace draft

## Process
1. inspect the repo before proposing changes
2. find entrypoints, docs, skills, plugins, configs, and runtime-sensitive files
3. classify files into protected / safe / approval-needed buckets
4. write an adaptation plan from structured facts, not guesses
5. produce rename candidates in dry-run form first
6. hand off concise changes and skipped items to change-trace

## Evaluator criteria
- entrypoints and important docs are surfaced
- folder purposes are easier to infer
- risky files are isolated instead of mixed with safe changes
- the adaptation plan is backed by concrete repo facts

## Rules
- inspect before proposing
- do not modify protected/core files by default
- separate safe renames from approval-required renames
- prefer dry-run output when import/runtime coupling is unclear
