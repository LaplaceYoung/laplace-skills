---
name: humanvoice-studio
description: Turn stiff AI writing into clear, natural, audience-aware human language across daily chat, social posting, academic writing, and long-form writing.
---

# Humanvoice Studio

## Overview

Use this skill when the user asks for text that sounds like a real person instead of a template generator. It prioritizes clarity, specificity, and tone control while preserving factual content.

## Use When

- Daily replies sound robotic or over-formal.
- Social posts need stronger voice and better readability.
- Academic writing must stay precise but less mechanical.
- Long-form writing needs rhythm, structure, and narrative flow.
- User asks to rewrite content into more natural language.

## Do Not Use When

- User explicitly asks for rigid legal contract style.
- User asks for intentionally formal government/bureaucratic tone.
- User asks for direct quote-preserving copy edit only.

## Workflow

1. Identify the scene and audience.
2. Detect language. If Chinese, load `prompts/zh/core/` first.
3. Apply `prompts/core/system.md` and `prompts/core/style-rules.md`.
4. Load one matching scene prompt from `prompts/scenes/` or `prompts/zh/scenes/`.
5. Enforce anti-pattern checks from `prompts/core/anti-patterns.md` and Chinese-specific checks.
6. If requested, score output quality with `references/rubric.md`.
7. For fiction tasks, optionally run corpus-calibrated loop:
   - fetch/clean human corpus
   - build style profile
   - rewrite
   - run diagnostics
   - log iteration evidence

## Scene Routing

- `daily-chat.md`: everyday conversation, explanations, replies.
- `social-post.md`: short posts, thread openers, hook + body + CTA.
- `academic-writing.md`: abstract-like prose, related-work summaries, reviewer response.
- `longform-writing.md`: essays, opinion pieces, narrative non-fiction.
- `rewrite-paraphrase.md`: transform existing text while preserving meaning.
- `zh/scenes/zh-daily-chat.md`: 中文日常回复去模板腔，参考 talk-normal 的“直白、短句、可读”方向。
- `zh/scenes/zh-social-post.md`: 中文发帖分平台（小红书/公众号/朋友圈/微博）适配。
- `zh/scenes/zh-academic-writing.md`: 中文学术写作，弱化机械句，默认避免“判断句/定义句”。
- `zh/scenes/zh-longform-writing.md`: 中文长文，支持“通俗叙述”与“冰心风格轻拟态”两档。
- `zh/scenes/zh-rewrite-paraphrase.md`: 中文改写与语气转换，保留事实信息。
- `zh/scenes/zh-fiction-novel.md`: 中文小说专用改写，重点处理叙事模板腔、角色同声和章节收束口号化。

## Output Pattern

Use this concise format unless the user asks otherwise:

1. Final text
2. Optional: micro rationale (3 bullets max)
3. Optional: alternatives (1-3 variants)

## Quality Guardrails

- Keep claims faithful to source input.
- Prefer concrete nouns/verbs over abstract filler.
- Remove empty transition phrases and repetitive hedges.
- Keep paragraph lengths intentionally varied.
- Avoid AI-sounding endings like “overall, in summary, in conclusion” unless requested.
