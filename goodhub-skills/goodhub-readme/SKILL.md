---
name: goodhub-readme
description: README writing and polishing for GitHub repositories. Use when Codex needs to create or rewrite a README, add badges, add multilingual navigation, improve project positioning, add installation and usage sections, or make a repo homepage feel more polished and open-source-ready. Default README language support should include Simplified Chinese, Traditional Chinese, and English unless the user asks for a different language set.
---

# goodhub-readme

Write README files that feel like real open-source repositories, not generated filler.

## Default structure
1. Project name
2. One-line value proposition
3. Badges only if they add signal
4. Screenshot or demo section if relevant
5. Features
6. Quick start / installation
7. Usage
8. Project structure or architecture if helpful
9. Roadmap or limitations when honesty matters
10. Contributing
11. License

## Badge guidance
- Keep status badges to 3-5 items.
- Prefer meaningful badges: license, release, build, coverage, stars.
- Add stack badges only when they improve scanning.
- Avoid badge walls.

## Multilingual README guidance
- Default to three README variants:
  - `README.md` - English
  - `README.zh-CN.md` - Simplified Chinese
  - `README.zh-TW.md` - Traditional Chinese
- Put language links at the top of every variant.
- Keep installation steps, feature claims, and warnings consistent across languages.
- If the user only asks for one README file, still propose the three-language structure unless they explicitly want a single-language repo.

## Style rules
- Lead with what the repo is and who it is for.
- Do not overclaim maturity, users, performance, or compatibility.
- Replace vague phrases with specifics.
- Prefer short sections and scannable bullets.
- If the repo is unofficial, reconstructed, archived, or experimental, say so early.

## Deliverables
Produce one of:
- full `README.md`
- rewritten top section
- badge block
- multilingual README trio
- README improvement checklist
