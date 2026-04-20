# Claude Design → Codex Full Parity Migration Design

**Date:** 2026-04-20
**Source Prompt:** `Claude-Design-Sys-Prompt.txt`
**Target:** Codex-compatible plugins + skills + local scripts + MCP + browser automation
**Parity Goal:** Full parity

---

## Goal

Restore the full functional surface of the original design-agent system prompt and re-express it as a maintainable Codex-native platform composed of plugins, skills, scripts, MCP services, and browser-driven verification.

## Success Criteria

1. The migrated system supports the same task classes as the source prompt: HTML artifact design, interactive prototypes, decks, animation artifacts, export flows, asset workflows, and design-context-guided iteration.
2. The migrated system preserves the original operational loop: intake → context discovery → build → preview → validate → export → handoff.
3. Each original function call lands in an explicit Codex-compatible execution surface.
4. Each original built-in skill lands in a Codex skill or a tightly scoped plugin workflow.
5. The system remains modular, testable, and independently extensible.

## Project Phase

MVP foundation with full-parity target. The first release should prioritize a working vertical slice for the most critical runtime loop, followed by incremental completion of the long-tail capability set.

## Constraints

1. The source system assumes a host runtime with native preview, asset review, verifier, question form, and file/project abstractions.
2. Codex provides different execution primitives, so several host-native capabilities require an adaptation layer.
3. The migration should preserve user-facing behavior while allowing implementation details to shift into scripts, MCP, and browser automation.
4. The repo currently contains analysis artifacts and source prompt text, and needs fresh runtime structure.

## Recommended System Architecture

### 1. Prompt Layer
A slim top-level Codex instruction set should define role, guardrails, workflow order, IP policy, and skill routing. It should stay compact and delegate specialized behavior to skills and plugins.

### 2. Skill Layer
Skills should own domain behavior and user-visible workflows.

Suggested skill set:
- `claude-design-core`
- `claude-design-intake`
- `claude-design-html-artifact`
- `claude-design-prototype`
- `claude-design-deck`
- `claude-design-animation`
- `claude-design-tweaks`
- `claude-design-export-pptx-editable`
- `claude-design-export-pptx-screenshots`
- `claude-design-export-pdf`
- `claude-design-export-standalone-html`
- `claude-design-canva-handoff`
- `claude-design-dev-handoff`
- `claude-design-pdf-read`
- `claude-design-frontend-direction`
- `claude-design-design-system`

### 3. Plugin Layer
Plugins should expose reusable command entrypoints and packaged workflows.

Suggested plugin packs:
- `claude-design-runtime`
- `claude-design-artifacts`
- `claude-design-export`
- `claude-design-github`
- `claude-design-browser`

### 4. Script Layer
Scripts should carry deterministic work that benefits from a local executable surface.

Suggested script families:
- scaffolding
- asset registry
- HTML bundling
- PPTX export
- PDF export handoff
- template save helpers
- question form rendering data helpers
- project manifest management

### 5. MCP Layer
MCP services should expose structured resources, state, and tool-like endpoints that benefit from typed I/O and shared runtime state.

Suggested MCP servers:
- `design-runtime-mcp`
- `design-preview-mcp`
- `design-assets-mcp`
- `design-verifier-mcp`
- `design-github-mcp`

### 6. Browser Automation Layer
Browser automation should implement preview opening, DOM probing, console inspection, screenshot capture, user-view JS execution, and verifier-style checks.

Primary surface:
- Chrome DevTools MCP in Codex sessions

Secondary surface:
- Playwright scripts for repeatable regression flows

## Capability Mapping

### A. Core file and project operations
Source functions:
- `read_file`
- `write_file`
- `list_files`
- `grep`
- `delete_file`
- `copy_files`
- `str_replace_edit`
- `register_assets`
- `unregister_assets`
- `set_project_title`
- `save_as_template`

Target implementation:
- Codex native file editing and shell tooling
- `design-assets-mcp` for asset registry and template metadata
- helper scripts for manifest persistence and version bookkeeping

### B. Preview and browser-state operations
Source functions:
- `show_html`
- `show_to_user`
- `done`
- `get_webview_logs`
- `save_screenshot`
- `multi_screenshot`
- `eval_js_user_view`
- `screenshot_user_view`
- `view_image`
- `image_metadata`

Target implementation:
- `design-preview-mcp` to standardize preview lifecycle
- Chrome DevTools MCP for page open, console, DOM, screenshots, JS evaluation
- `done` adapter command that opens preview, validates runtime health, records evidence, and hands off to verifier

### C. Build/runtime helpers
Source functions:
- `copy_starter_component`
- `run_script`
- `sleep`
- `super_inline_html`
- `open_for_print`
- `present_fs_item_for_download`
- `get_public_file_url`

Target implementation:
- starter component library in repo
- Node/Python scripts for bundling and export preparation
- MCP wrapper for public artifact URLs and download manifests

### D. Orchestration helpers
Source functions:
- `update_todos`
- `invoke_skill`
- `questions_v2`
- `snip`
- `fork_verifier_agent`

Target implementation:
- Codex update_plan for task tracking
- native Codex skill routing
- question-schema generator plus lightweight response capture format
- working-notes / state compaction helper for long sessions
- verifier workflow built from spawned verifier agent or browser regression script

### E. External data and repo context
Source functions:
- `connect_github`
- dynamic GitHub tools
- `web_search`
- `web_fetch`

Target implementation:
- GitHub-focused plugin or MCP wrapper around `gh`
- Codex web search for fresh information
- browser fetch or direct HTTP helper script for URL materialization

## Highest-Priority Full-Parity Flows

### Flow 1: Intake and context acquisition
1. Ask rich structured questions
2. Collect design system, screenshots, codebase, Figma, GitHub, or external references
3. Normalize imported materials into local project state

### Flow 2: HTML artifact generation
1. Choose artifact mode
2. Copy starter components when useful
3. Generate modular HTML/CSS/JS assets
4. Surface assumptions, options, and tweak controls

### Flow 3: Preview and delivery
1. Open artifact preview
2. Check console and DOM health
3. Capture screenshots or directed probes when requested
4. Run `done`-equivalent verification gate
5. Trigger verifier follow-up

### Flow 4: Export and packaging
1. Export editable PPTX
2. Export screenshot PPTX
3. Export print-friendly PDF handoff
4. Export standalone HTML bundle
5. Present download artifacts

### Flow 5: Long-session orchestration
1. Preserve structured todo state
2. Maintain working notes and compaction-safe summaries
3. Keep artifact and asset manifests consistent

## Proposed Repository Structure

```text
project/
  agents.md
  Claude-Design-Sys-Prompt.txt
  docs/
    superpowers/
      specs/
      plans/
      mappings/
  skills/
    claude-design-core/
    claude-design-intake/
    claude-design-html-artifact/
    claude-design-prototype/
    claude-design-deck/
    claude-design-animation/
    claude-design-tweaks/
    claude-design-export-pptx-editable/
    claude-design-export-pptx-screenshots/
    claude-design-export-pdf/
    claude-design-export-standalone-html/
    claude-design-canva-handoff/
    claude-design-dev-handoff/
    claude-design-pdf-read/
    claude-design-frontend-direction/
    claude-design-design-system/
  plugins/
    claude-design-runtime/
    claude-design-artifacts/
    claude-design-export/
    claude-design-github/
    claude-design-browser/
  mcp/
    design-runtime-mcp/
    design-preview-mcp/
    design-assets-mcp/
    design-verifier-mcp/
    design-github-mcp/
  scripts/
    asset-registry/
    starters/
    exports/
    preview/
    verifier/
    github/
  templates/
    starter-components/
    question-schemas/
    artifact-manifests/
  examples/
    prototype/
    deck/
    animation/
    design-system/
  tests/
    integration/
    regression/
    fixtures/
```

## Key Design Decisions

### Decision 1: Separate policy from execution
The top-level Codex instruction file should stay lean. Detailed behaviors should live in skills and plugins. This keeps the system easier to evolve.

### Decision 2: Recreate host-native tools as a runtime service layer
Functions like `done`, `questions_v2`, and `fork_verifier_agent` deserve named adapters instead of ad hoc shell scripts. MCP provides the cleanest abstraction.

### Decision 3: Treat browser automation as a first-class subsystem
Full parity depends on preview-state inspection and regression-style checks. Browser tooling belongs in the architecture from the beginning.

### Decision 4: Ship a vertical slice first
The first complete slice should cover:
- intake
- local context import
- starter component scaffold
- HTML artifact generation
- preview open
- console validation
- `done` gate
- verifier follow-up

### Decision 5: Add long-tail exports after the core loop
Canva handoff, template save, public URL generation, and editable PPTX export can follow after the core loop is solid.

## Validation Strategy

### Functional validation
- Each source function maps to a tested target implementation.
- Each source skill maps to an executable Codex skill or plugin flow.
- Each critical flow has an example artifact and a repeatable regression script.

### UX validation
- The migrated system supports fast iteration with clear steps.
- The user can move from idea to artifact to export without manual glue work.

### Maintainability validation
- Each subsystem has one clear responsibility.
- Scripts stay focused.
- MCP services expose typed boundaries.
- Skills focus on user-facing workflow language.

## Recommended Execution Sequence

1. Build the capability mapping and target manifests.
2. Scaffold repo structure.
3. Implement runtime MCP and preview MCP.
4. Implement `done` and verifier flow.
5. Implement starter-component and artifact-generation workflows.
6. Implement export workflows.
7. Implement GitHub/context import workflows.
8. Add regression examples and parity validation.

## Open Assumptions Chosen for This Plan

1. Full parity means behavioral parity, not byte-for-byte host replication.
2. Codex browser automation and local scripts can satisfy the preview and verification surface.
3. Local project state is the canonical source of truth for assets, manifests, and generated artifacts.
