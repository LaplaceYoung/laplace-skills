# Benchmark Notes

## Seed references
- https://github.com/hexiecs/talk-normal
- https://github.com/danielmiessler/fabric
- https://github.com/f/prompts.chat
- https://github.com/ahmetbersoz/chatgpt-prompts-for-academic-writing
- https://github.com/xuhangc/ChatGPT-Academic-Prompt
- https://github.com/Firdavs-coder/ai_humanizer

## What to borrow
- Task-based prompt routing
- Reusable prompt modules
- Regression-like quality checks
- Clear README + quick start paths

## What to avoid
- Prompt pile without quality rubric
- No scene boundaries
- No regression cases

## Extracted from original.md (Chinese focus)
- Daily chat should follow talk-normal direction: shorter, clearer, less bureaucratic.
- Long-form writing should keep high readability with plain vocabulary.
- Long-form Chinese rewrite can run in a restrained literary mode (`bingxin_lite`).
- Academic Chinese mode should avoid dense definition/judgment sentence patterns and avoid absolute tone.

## Extra extracted from benchmark repos
- talk-normal prompt enforces direct positive claims and explicitly bans negation-based contrast patterns (不是X而是Y / X而不是Y).
- talk-normal prompt bans summary-label closings ("简而言之/总结一下/一句话总结"), which strongly reduces template signatures.
- ai_humanizer README highlights punctuation/format variation and post-processing pipeline; this maps to our `De-AI Pass` step before final output.
- ai-flavor-remover prompt emphasizes sentence simplification and direct output constraints; for fiction this maps to reducing explanation-heavy narration.
- ainovelprompter workflows stress character consistency and chapter-level objective memory; for fiction rewriting this maps to role-specific voice and chapter-hook endings.
