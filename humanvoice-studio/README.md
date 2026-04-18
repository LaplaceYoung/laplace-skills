# Humanvoice Studio

Humanvoice Studio is a writing skill pack for making AI output sound natural, clear, and audience-aware.

## Scope
- Daily communication
- Social posting
- Academic writing
- Long-form writing
- Rewrite/paraphrase
- Chinese-specialized scenes (daily/social/academic/long-form/rewrite)

## Structure
- `SKILL.md`: entry and routing rules
- `prompts/core/`: global style rules
- `prompts/scenes/`: scene-specific prompts
- `prompts/zh/core/`: Chinese-specific writing rules
- `prompts/zh/scenes/`: Chinese scene prompts
- `prompts/zh/scenes/zh-fiction-novel.md`: Chinese fiction-specific de-AI rewriting scene
- `references/rubric.md`: humanvoice quality rubric
- `references/rubric-zh.md`: Chinese-specific scoring rubric
- `regressions/test-cases.json`: fixed evaluation set
- `regressions/test-cases-zh.json`: Chinese evaluation set
- `scripts/eval-humanvoice.ps1`: basic local evaluator
- `scripts/eval-fiction-style.ps1`: fiction-style diagnostics (dialogue ratio, template hits, repeated n-grams)
- `scripts/fetch-human-corpus-zh.ps1`: fetch seed human-written corpus sources
- `scripts/clean-human-corpus-zh.ps1`: clean HTML into plaintext corpus
- `scripts/build-corpus-style-profile-zh.ps1`: build style profile from human corpus
- `scripts/log-fiction-iteration.ps1`: log iterative tuning evidence

## Quick Start
1. Pick scene prompt from `prompts/scenes/`.
2. Apply core rules from `prompts/core/`.
3. Generate output.
4. Score with rubric if quality check is required.

## v0.1 status
- Core prompt rules: ready
- Scene prompts: ready (5 scenes)
- Chinese scene prompts: ready (5 scenes)
- Regression set: initial draft
- Evaluator script: initial draft

## Repo Hygiene
- `corpus/raw/` and `corpus/clean/` keep `.gitkeep` only; fetched/cleaned artifacts stay local.
- `workspace/` keeps reusable notes only; generated profiles/logs are ignored.
- Rule changes should require repeated evidence across multiple texts to avoid overfitting.
