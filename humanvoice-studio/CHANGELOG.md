# Changelog

## 2026-04-18 - v0.1 scaffold
- Added initial skill scaffold.
- Added core prompts and 5 scene prompts.
- Added initial rubric, regression cases, and draft evaluator script.
- Added bilingual README and agent config.

## 2026-04-18 - zh optimization from original.md
- Added Chinese-specific core rules: `prompts/zh/core/zh-system.md` and `prompts/zh/core/zh-anti-patterns.md`.
- Added Chinese scene prompts for daily chat, social post, academic writing, long-form writing, and rewrite.
- Added `references/rubric-zh.md` for Chinese quality scoring.
- Added `regressions/test-cases-zh.json` seeded from original constraints.
- Updated `SKILL.md`, `README.md`, `README_CN.md`, and `agents/openai.yaml` for Chinese routing.

## 2026-04-18 - zh de-ai pass v2
- Strengthened Chinese core rules with `De-AI Pass` (template phrase removal, anti-symmetry sentence shaping, concrete closing).
- Upgraded `zh-academic-writing` with strict anti-judgment conversion steps and output checklist.
- Added benchmark-derived rules from `talk-normal` and `ai_humanizer` into `references/benchmark-notes.md`.

## 2026-04-18 - fiction de-ai scene
- Added `prompts/zh/scenes/zh-fiction-novel.md` for novel-specific rewriting.
- Added fiction-focused constraints: anti-template narration, character voice separation, hook-style chapter endings.
- Synced fiction benchmark learnings from `ai-flavor-remover` and `ainovelprompter`.

## 2026-04-18 - fiction optimization v2
- Added `references/fiction-style-notes-zh.md` with transferable observations from real novel practice.
- Strengthened `zh-fiction-novel` with measurable targets and dialogue-tag dedup rules.
- Added `scripts/eval-fiction-style.ps1` for quantitative fiction diagnostics.
- Produced `test/novel_v3_humanized.md` under the updated fiction rules.

## 2026-04-18 - fiction strong rewrite mode
- Added strong rewrite controls in `zh-fiction-novel` (less Markdown structure, human-noise option, anti-overpolish).
- Produced `test/novel_v4_humanized.md` with stronger anti-template fiction style.
- Verified v4 diagnostics: key template hits dropped to zero in the tracked pattern set.

## 2026-04-18 - anti-overfit generalization update
- Refactored `zh-fiction-novel` to prioritize text-agnostic structural constraints over hardcoded phrase bans.
- Added explicit generalization guidance (cross-genre consistency, event-lock + length-lock).
- Upgraded `eval-fiction-style.ps1` to generalized pattern-category diagnostics with optional external pattern file.
- Produced length-locked sample `test/novel_v9_humanized_full.md` (91.9% of source length).

## 2026-04-18 - corpus-driven iteration pipeline
- Added `corpus/sources-human-zh.json` for curated human-written seed sources.
- Added corpus scripts: fetch, clean, style-profile build.
- Added iterative evidence logger script for fiction tuning loops.
- Updated README/SKILL workflow to require cross-text evidence before rule changes (anti-overfit).

## 2026-04-18 - corpus pipeline hardening
- Added `workspace/x-notes.md` with curated X permalink notes and evidence policy.
- Added `x_experience_refs` into corpus source metadata with context-only usage.
- Improved corpus cleaning script to prefer MediaWiki main-content extraction.
- Improved style-profile script to report both sentence and clause statistics.
