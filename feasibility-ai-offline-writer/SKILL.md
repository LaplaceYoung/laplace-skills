---
name: feasibility-ai-offline-writer
description: Use when users need offline feasibility-study drafting, review, scheme-building, or outline-selection workflows from a recovered prompt corpus, especially when they want reusable system, task, review, expert, and outline prompts without depending on the original app.
---

# FeasibilityAI Offline Writer

## Overview

This skill packages the recovered FeasibilityAI prompt corpus into a reusable offline workflow.
Use it when we want to draft chapters, review text, revise content, extract structured facts, run consistency checks, build schemes, or select industry outlines without depending on the original application. Keep it scoped to offline prompt reuse and workflow reconstruction.

## When to Use

- We need a reusable offline prompt library for feasibility-study or engineering-consulting writing.
- We want to reuse the recovered `system`, `tasks`, `review`, `scheme`, `experts`, or `outline` data.
- We need to inspect prompts by key instead of re-opening the Electron bundle.
- We want a model-agnostic prompt workflow derived from the FeasibilityAI corpus.

Do **not** use this skill for private API replay, vendor authentication bypass, or extraction of secrets from protected services.

## Quick Workflow

1. **Pick the workflow family**
   - Chapter drafting -> read `references/system-prompts.md` and fetch the relevant chapter prompt with `scripts/lookup_prompt.py`
   - QA / review / revise / extract / consistency -> read `references/task-prompts.md` or `references/review-prompts.md`
   - Scheme building -> read `references/scheme-prompts.md`
   - Industry expert alignment -> read `references/expert-index.md`
   - Outline selection -> read `references/outline-index.md` and use `scripts/select_outline.py`

2. **Inspect exact prompt entries**
   - `python scripts/lookup_prompt.py --list-groups`
   - `python scripts/lookup_prompt.py --group system`
   - `python scripts/lookup_prompt.py --key system/government`
   - `python scripts/lookup_prompt.py --search consistency`

3. **Inspect outline coverage**
   - `python scripts/select_outline.py --list-majors`
   - `python scripts/select_outline.py --major A1 --list-subgroups`
   - `python scripts/select_outline.py --major A1 --subgroup municipal`
   - `python scripts/select_outline.py --search sewage`

## Bundled Data

- `assets/prompts.json` ? full recovered prompt/config corpus
- `assets/outlines.json` ? full recovered outline/template corpus

## References

- `references/prompt-taxonomy.md` ? prompt families and usage map
- `references/system-prompts.md` ? system-level writing roles and output rules
- `references/task-prompts.md` ? generic task prompts for write/review/revise/extract/polish
- `references/review-prompts.md` ? stricter review-agent prompts
- `references/scheme-prompts.md` ? interviewer / architect / reviewer trio
- `references/expert-index.md` ? expert-category map and lookup guidance
- `references/outline-index.md` ? major/subgroup outline catalog
- `references/project-structure.md` ? recovered project file structure and local data model

## Practical Guidance

- Treat the bundled prompts as **prompt resources**, not as claims that a specific hosted model is required.
- Prefer reading only the reference file relevant to the current job; use the scripts for exact entry lookup.
- When drafting content, combine:
  1. one system role,
  2. one chapter/task prompt,
  3. optional expert prompt,
  4. optional outline/template constraints.
- When auditing content, prefer `review/*` over `tasks/*` if we want stricter audit framing.

## Common Patterns

### Draft a chapter
- Read `references/system-prompts.md`
- Fetch chapter config like `government_2023/chapters/4_site`
- Optionally fetch `experts/<category>`
- Build the final prompt in your working context

### Review and revise a chapter
- Start with `review/review` or `tasks/review`
- Then use `review/revise` or `tasks/revise`
- Use `tasks/extract` / `review/extract` when we need structured facts first

### Build a scheme interview flow
- Read `references/scheme-prompts.md`
- Use `scheme/interviewer` to ask for missing data
- Use `scheme/architect` to transform facts into structured patches
- Use `scheme/reviewer` to check missing technical fields and risks

## Notes

- This skill is derived from the locally recovered FeasibilityAI desktop bundle.
- The recovered client labels the upstream provider as `deepseek` and the default model as `deepseek-chat`, but this skill is intentionally offline and model-agnostic.
