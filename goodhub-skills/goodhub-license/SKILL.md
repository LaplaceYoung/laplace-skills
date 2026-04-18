---
name: goodhub-license
description: Open-source license selection and license-file writing for GitHub repositories. Use when Codex needs to recommend a software license, explain MIT vs Apache-2.0 vs GPL style tradeoffs, or generate an exact LICENSE file without modifying the official text improperly.
---

# goodhub-license

Be conservative and exact.

## Rules
- Use standard license text.
- Do not paraphrase the body of a license.
- Only customize the copyright line where appropriate.
- If unsure which license fits, ask whether the repo wants maximum adoption, explicit patent protection, or copyleft.

## Default suggestion
- Default to MIT unless the user explicitly requests a different license or the repo clearly needs stronger patent protection or copyleft terms.

## Deliverables
Produce one of:
- license recommendation
- `LICENSE` file content
- README license section
