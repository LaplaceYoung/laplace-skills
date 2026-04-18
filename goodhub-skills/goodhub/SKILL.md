---
name: goodhub
description: GitHub workflow router and repository-writing guide. Use when Codex needs to decide whether a task is best handled as README writing, pull request drafting, issue authoring, commit message editing, repository standards review, license selection, or CONTRIBUTING guidance.
---

# goodhub

Route GitHub-related requests to the most specific `goodhub-*` skill.

## Routing
- Use `goodhub-readme` for README structure, badges, screenshots, and README variants. Default README language support should include Simplified Chinese, Traditional Chinese, and English unless the user asks for a different language set.
- Use `goodhub-pr` for pull request titles, bodies, changelog notes, reviewer notes, and test plans.
- Use `goodhub-issue` for bug reports, feature requests, issue forms, and issue triage copy.
- Use `goodhub-commit` for commit messages, conventional commit cleanup, squash summaries, and commit grouping.
- Use `goodhub-repo-standards` for repo audits and missing `.github` governance files.
- Use `goodhub-license` for selecting and writing LICENSE files.
- Use `goodhub-contributing` for CONTRIBUTING.md and contribution workflow guidance.

## Default quality bar
- Prefer copy-paste-ready output.
- Match the maturity level of the target repo.
- Avoid empty hype and AI-sounding filler.
- Keep claims honest and verifiable.
