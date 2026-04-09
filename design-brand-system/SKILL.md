---
name: design-brand-system
description: Translate a named brand or product's visual language into reusable UI guidance, implementation direction, and design constraints for web or app interfaces. Use when the user asks to make something look like a specific brand, wants brand-inspired UI style transfer, requests design-system guidance from curated references, compares brands such as Apple, Linear, Vercel, Notion, Stripe, Airbnb, Tesla, Framer, or similar entries in this skill's reference index, or needs a fallback shortlist of brands by visual mood.
---

# Design Brand System

## Overview

Use this skill to turn a brand reference into concrete design rules another agent can build from. Keep the workflow lightweight: identify the brand, read only the matching reference file, then convert it into actionable layout, typography, color, component, and motion guidance.

## Workflow

1. Read [references/index.md](references/index.md) first.
2. If the user names a supported brand, open only that brand's reference file.
3. If the user names multiple brands, open only those files and compare them.
4. If the user describes a vibe instead of a brand, use the shortlist in `references/index.md` to suggest 3-5 candidates, then continue with the chosen one.
5. If the user asks for implementation, translate the reference into build-ready instructions instead of repeating the source text verbatim.

## Brand Resolution

- Treat folder-style brand ids as canonical filenames. Examples:
  - `linear.app` -> `references/linear.app.md`
  - `mistral.ai` -> `references/mistral.ai.md`
  - `opencode.ai` -> `references/opencode.ai.md`
  - `together.ai` -> `references/together.ai.md`
  - `x.ai` -> `references/x.ai.md`
- If a user uses a display name variant, map it to the canonical file before reading.
- If a reference is marked unavailable in the index, say so directly and offer the closest alternatives.

## Output Pattern

When answering from a brand reference, prefer this structure:

1. Brand summary
2. Visual system
3. Component and interaction rules
4. Implementation guidance
5. Avoid list

Keep each section short unless the user asks for depth.

## Translation Rules

- Convert brand language into implementation-ready guidance.
- Prefer concrete tokens, spacing behavior, hierarchy, interaction patterns, and composition rules.
- Do not dump the entire reference unless the user explicitly asks for the raw document.
- Do not invent brand traits that are not supported by the chosen reference.
- If the user is building inside an existing design system, adapt the brand cues instead of replacing the host system wholesale.
- If the user wants a fresh design direction, preserve the strongest distinguishing traits from the reference rather than averaging them away.

## Reference Use

- Use [references/index.md](references/index.md) to choose files and to suggest alternatives by mood.
- Read only the brand files required for the current request.
- The brand files are long by design. Summarize them after reading; do not echo them line by line.

## Failure Modes

- If the user asks for a brand that is not in the index, say that the skill does not contain that reference yet.
- If the user asks for a hybrid style, identify where the references are compatible and where they conflict.
- If the request is too vague, ask for either:
  - a target brand, or
  - a mood such as minimal editorial, luxury automotive, dark developer tool, playful SaaS, or premium consumer.
