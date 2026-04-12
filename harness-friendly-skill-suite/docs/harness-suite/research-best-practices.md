# Harness Engineering Research Notes

## Scope
This document distills official OpenAI and Anthropic guidance relevant to a repository-adaptation harness: a system that makes projects more legible, safer, and easier for agents to operate on over long or repeated runs.

## What the primary sources emphasize

### 1. Harness > prompt alone
OpenAI frames harness engineering as designing the environment, intent specification, and feedback loops around the model rather than only writing better prompts.

### 2. Start simple
OpenAI's agent guide recommends starting with a single agent and only introducing manager/sub-agent orchestration when task complexity actually requires it.

### 3. Structured artifacts beat implicit memory
Anthropic's long-running harness work emphasizes decomposing work into tractable chunks and using structured artifacts to hand off context between sessions/phases.

### 4. Evaluators need explicit criteria
Anthropic shows that subjective or fuzzy quality goals become more reliable when translated into concrete grading criteria shared by both the generator and evaluator.

### 5. Guardrails must be layered
OpenAI recommends combining multiple guardrail types. Anthropic similarly emphasizes permissions, sandboxing, and approval boundaries.

### 6. Standardized tools improve discoverability
OpenAI recommends well-documented, thoroughly tested, reusable tools with standardized definitions. Anthropic's agent SDK and MCP guidance similarly point toward standardized tool surfaces.

### 7. Human intervention remains part of the harness
OpenAI explicitly recommends handoff on high-risk or irreversible actions. Anthropic's sandboxing and permissions guidance align with this.

### 8. Long-running systems need observability and resumability
Anthropic's harness design and SDK materials emphasize session management, monitoring, structured handoffs, and multi-phase workflows.

## Best practices for our skill suite

### A. Use a single orchestrator by default
Do not over-multi-agent the adaptation flow. Use `harness-adapt` as the single manager. Only branch into sub-skills because the responsibilities are distinct and bounded, not because more agents are always better.

### B. Every phase must produce a visible artifact
At minimum produce:
- repo inventory
- protected areas list
- adaptation plan
- naming normalization plan
- change trace

This follows Anthropic's structured-handoff principle and reduces hidden state.

### C. Convert vague goals into gradeable checks
Examples:
- "more AI-friendly" -> clearer entrypoints, descriptive filenames, index docs present
- "safer" -> protected areas listed, approval-needed items isolated
- "traceable" -> concise change trace emitted

### D. Keep tools and outputs standardized
Each skill should declare:
- inputs
- outputs
- protected-area behavior
- stop conditions
- approval gates

### E. Layer risk controls
Use multiple layers:
1. scope/non-goals
2. protected areas
3. safe-vs-risky rename classification
4. approval-required section
5. final report

### F. Prefer dry-run first for risky actions
Especially for renames or moves that could affect imports, routing, config, builds, or deployment.

### G. Separate planner and evaluator responsibilities
The suite should not only propose changes; it should also check whether the repo is now more legible according to explicit criteria.

### H. Optimize for legibility, not maximal automation
This matches the user's chosen primary objective and also aligns with OpenAI's emphasis on agent-legible environments.

## Concrete implications for this repo
- add an explicit adaptation-plan artifact
- make evaluator criteria first-class in docs and skills
- add stop conditions and approval gates to every skill
- make observability/report outputs mandatory, not optional

## Sources
- OpenAI, "Harness engineering: leveraging Codex in an agent-first world" (published February 11, 2026): https://openai.com/index/harness-engineering/
- OpenAI, "A practical guide to building agents": https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/
- Anthropic, "Harness design for long-running application development" (published March 24, 2026): https://www.anthropic.com/engineering/harness-design-long-running-apps
- Anthropic, "Building agents with the Claude Agent SDK" (published September 29, 2025): https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk/
- Anthropic Claude Code SDK overview: https://docs.anthropic.com/en/docs/claude-code/sdk
- Anthropic, "Making Claude Code more secure and autonomous with sandboxing": https://www.anthropic.com/engineering/claude-code-sandboxing
