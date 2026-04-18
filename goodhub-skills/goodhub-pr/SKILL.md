---
name: goodhub-pr
description: Pull request writing for GitHub repositories. Use when Codex needs to draft or normalize a PR title or body, explain why a change exists, summarize implementation scope, document testing, describe user impact, or prepare review-ready pull request text.
---

# goodhub-pr

Write PRs that reduce reviewer effort.

## Core PR sections
- Summary
- Why
- What changed
- How to test
- Impact / risks
- Related issue
- Screenshots when UI changed

## Title guidance
- Use outcome-oriented titles.
- Prefer specific titles over generic fixes.
- If following conventional style, keep the scope short.

## Body guidance
- Explain intent before implementation details.
- Separate user-facing impact from internal refactor notes.
- Call out migrations, breaking changes, and follow-ups.
- If no tests were run, say so plainly and explain why.

## Deliverables
Produce one of:
- PR title only
- full PR body
- title + body + checklist
- reviewer notes
- release-note paragraph
