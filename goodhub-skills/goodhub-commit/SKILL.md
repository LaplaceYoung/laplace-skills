---
name: goodhub-commit
description: Commit message editing and commit-plan writing for GitHub repositories. Use when Codex needs to write or improve commit messages, apply Conventional Commits, prepare squash commit summaries, group changes into logical commits, or tighten noisy git history.
---

# goodhub-commit

Write commit messages that make history easier to scan.

## Default rules
- Subject line first, short and specific.
- Prefer imperative mood.
- Mention scope only if it adds signal.
- Group unrelated changes into separate commit suggestions.

## Conventional commit mode
Use when the repo already follows it or the user asks for it.

Format:
`type(scope): short summary`

Common types:
- feat
- fix
- docs
- refactor
- test
- chore
- build
- ci

## Deliverables
Produce one of:
- one commit message
- a list of commit messages for a diff
- squash commit title + body
- breaking-change footer
