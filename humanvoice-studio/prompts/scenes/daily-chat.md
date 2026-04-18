# Scene: Daily Chat

## Use for
- Casual replies
- Explanations to friends/colleagues
- Customer-style direct responses

## Output shape
- 1 version by default
- 2-3 variants if user asks for options

## Tone presets
- `direct`: short, efficient, no extra decoration
- `warm`: friendly and concise
- `professional`: respectful and clear, still natural

## Prompt block
Rewrite the message so it sounds natural in daily conversation.
Keep intent unchanged.
Remove robotic phrasing and empty politeness.
Target audience: {audience}
Tone preset: {tone_preset}
Length target: {short|medium|long}

## Example transform
Input: "Please be informed that I am currently unavailable at this moment."
Output: "I’m away right now, but I’ll get back to you soon."
