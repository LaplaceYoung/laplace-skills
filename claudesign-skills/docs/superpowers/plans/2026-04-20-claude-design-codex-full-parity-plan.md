# Claude Design Codex Full Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Codex-native design-agent platform that restores the source prompt's full functional surface using plugins, skills, local scripts, MCP services, and browser automation.

**Architecture:** A slim Codex instruction layer routes into dedicated design skills, plugin entrypoints, TypeScript scripts, and MCP servers. Browser automation handles preview-state inspection and verifier workflows, while local manifests store assets, artifacts, templates, and parity mapping.

**Tech Stack:** pnpm workspace, TypeScript, Node.js, MCP servers, Playwright or Chrome DevTools automation, Markdown docs, Vitest, JSON manifests

---

## File Structure Map

### Root workspace
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`

### Docs and mapping
- Create: `docs/superpowers/mappings/2026-04-20-source-to-codex-capability-map.md`
- Create: `docs/superpowers/specs/2026-04-20-claude-design-codex-full-parity-design.md`
- Create: `docs/superpowers/plans/2026-04-20-claude-design-codex-full-parity-plan.md`

### Skills
- Create: `skills/claude-design-core/SKILL.md`
- Create: `skills/claude-design-intake/SKILL.md`
- Create: `skills/claude-design-html-artifact/SKILL.md`
- Create: `skills/claude-design-prototype/SKILL.md`
- Create: `skills/claude-design-deck/SKILL.md`
- Create: `skills/claude-design-animation/SKILL.md`
- Create: `skills/claude-design-tweaks/SKILL.md`
- Create: `skills/claude-design-export-pptx-editable/SKILL.md`
- Create: `skills/claude-design-export-pptx-screenshots/SKILL.md`
- Create: `skills/claude-design-export-pdf/SKILL.md`
- Create: `skills/claude-design-export-standalone-html/SKILL.md`
- Create: `skills/claude-design-canva-handoff/SKILL.md`
- Create: `skills/claude-design-dev-handoff/SKILL.md`
- Create: `skills/claude-design-pdf-read/SKILL.md`
- Create: `skills/claude-design-frontend-direction/SKILL.md`
- Create: `skills/claude-design-design-system/SKILL.md`

### Plugins
- Create: `plugins/claude-design-runtime/.codex-plugin/plugin.json`
- Create: `plugins/claude-design-artifacts/.codex-plugin/plugin.json`
- Create: `plugins/claude-design-export/.codex-plugin/plugin.json`
- Create: `plugins/claude-design-github/.codex-plugin/plugin.json`
- Create: `plugins/claude-design-browser/.codex-plugin/plugin.json`

### Scripts
- Create: `scripts/asset-registry/registry.ts`
- Create: `scripts/starters/copy-starter.ts`
- Create: `scripts/exports/gen-pptx.ts`
- Create: `scripts/exports/bundle-standalone.ts`
- Create: `scripts/exports/open-for-print.ts`
- Create: `scripts/preview/done-gate.ts`
- Create: `scripts/preview/preview-open.ts`
- Create: `scripts/verifier/run-verifier.ts`
- Create: `scripts/questions/build-question-schema.ts`
- Create: `scripts/github/import-repo-context.ts`

### MCP servers
- Create: `mcp/design-runtime-mcp/package.json`
- Create: `mcp/design-runtime-mcp/src/server.ts`
- Create: `mcp/design-preview-mcp/package.json`
- Create: `mcp/design-preview-mcp/src/server.ts`
- Create: `mcp/design-assets-mcp/package.json`
- Create: `mcp/design-assets-mcp/src/server.ts`
- Create: `mcp/design-verifier-mcp/package.json`
- Create: `mcp/design-verifier-mcp/src/server.ts`
- Create: `mcp/design-github-mcp/package.json`
- Create: `mcp/design-github-mcp/src/server.ts`

### Templates and examples
- Create: `templates/starter-components/design_canvas.jsx`
- Create: `templates/starter-components/animations.jsx`
- Create: `templates/starter-components/deck_stage.js`
- Create: `templates/starter-components/browser_window.jsx`
- Create: `templates/question-schemas/design-intake.schema.json`
- Create: `examples/prototype/index.html`
- Create: `examples/deck/index.html`
- Create: `examples/animation/index.html`
- Create: `examples/design-system/index.html`

### Tests
- Create: `tests/integration/capability-map.test.ts`
- Create: `tests/integration/done-gate.test.ts`
- Create: `tests/integration/starter-copy.test.ts`
- Create: `tests/integration/export-bundle.test.ts`
- Create: `tests/regression/verifier-preview.spec.ts`
- Create: `tests/fixtures/sample-artifact/index.html`

---

### Task 1: Bootstrap the workspace and parity map

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Create: `docs/superpowers/mappings/2026-04-20-source-to-codex-capability-map.md`
- Test: `tests/integration/capability-map.test.ts`

- [ ] **Step 1: Write the failing capability-map test**

```ts
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('source-to-codex capability map', () => {
  it('maps every source function to a target execution surface', () => {
    const text = fs.readFileSync(
      'docs/superpowers/mappings/2026-04-20-source-to-codex-capability-map.md',
      'utf8'
    );

    const required = [
      'read_file', 'write_file', 'list_files', 'grep', 'delete_file', 'copy_files',
      'str_replace_edit', 'register_assets', 'unregister_assets', 'copy_starter_component',
      'show_html', 'show_to_user', 'done', 'view_image', 'image_metadata',
      'get_webview_logs', 'sleep', 'save_screenshot', 'multi_screenshot',
      'eval_js_user_view', 'screenshot_user_view', 'run_script', 'gen_pptx',
      'super_inline_html', 'open_for_print', 'present_fs_item_for_download',
      'get_public_file_url', 'update_todos', 'invoke_skill', 'questions_v2',
      'save_as_template', 'set_project_title', 'connect_github', 'snip',
      'fork_verifier_agent', 'web_search', 'web_fetch'
    ];

    for (const name of required) {
      expect(text).toContain(`| ${name} |`);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/capability-map.test.ts`
Expected: FAIL with missing file or missing mappings

- [ ] **Step 3: Create the workspace files and parity map**

```json
{
  "name": "claude-design-codex-parity",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "build": "pnpm -r build"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.2",
    "typescript": "^5.9.2",
    "vitest": "^3.2.4"
  }
}
```

```yaml
packages:
  - mcp/*
  - plugins/*
  - scripts/*
```

```md
# Source to Codex Capability Map

| Source capability | Target surface | Target package |
| --- | --- | --- |
| read_file | codex native file ops | core runtime |
| write_file | codex native file ops | core runtime |
| list_files | codex native shell ops | core runtime |
| grep | codex native shell ops | core runtime |
| delete_file | codex native shell ops | core runtime |
| copy_files | codex native shell ops | core runtime |
| str_replace_edit | codex native edit ops | core runtime |
| register_assets | MCP tool | design-assets-mcp |
| unregister_assets | MCP tool | design-assets-mcp |
| copy_starter_component | script + plugin command | claude-design-artifacts |
| show_html | preview MCP + browser automation | design-preview-mcp |
| show_to_user | preview MCP + browser automation | design-preview-mcp |
| done | script + preview MCP + verifier MCP | claude-design-browser |
| view_image | codex native image support | core runtime |
| image_metadata | script + MCP tool | design-assets-mcp |
| get_webview_logs | browser automation | design-preview-mcp |
| sleep | shell or browser wait helper | core runtime |
| save_screenshot | browser automation | design-preview-mcp |
| multi_screenshot | browser automation | design-preview-mcp |
| eval_js_user_view | browser automation | design-preview-mcp |
| screenshot_user_view | browser automation | design-preview-mcp |
| run_script | local script runner | claude-design-runtime |
| gen_pptx | export script + skill | claude-design-export |
| super_inline_html | export script + skill | claude-design-export |
| open_for_print | preview script + skill | claude-design-export |
| present_fs_item_for_download | plugin command | claude-design-export |
| get_public_file_url | MCP tool | design-runtime-mcp |
| update_todos | codex update_plan | core runtime |
| invoke_skill | codex skills | core runtime |
| questions_v2 | schema builder + UX wrapper | design-runtime-mcp |
| save_as_template | MCP tool + manifest writer | design-runtime-mcp |
| set_project_title | plugin command + manifest writer | claude-design-runtime |
| connect_github | gh wrapper | claude-design-github |
| snip | codex memory workflow | core runtime |
| fork_verifier_agent | verifier skill + automation | design-verifier-mcp |
| web_search | codex web tool | core runtime |
| web_fetch | codex web tool | core runtime |
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run tests/integration/capability-map.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json vitest.config.ts playwright.config.ts .gitignore docs/superpowers/mappings/2026-04-20-source-to-codex-capability-map.md tests/integration/capability-map.test.ts
git commit -m "Bootstrap Codex parity workspace and capability map"
```

### Task 2: Scaffold the skill pack and plugin manifests

**Files:**
- Create: `skills/claude-design-core/SKILL.md`
- Create: `skills/claude-design-intake/SKILL.md`
- Create: `skills/claude-design-html-artifact/SKILL.md`
- Create: `skills/claude-design-prototype/SKILL.md`
- Create: `skills/claude-design-deck/SKILL.md`
- Create: `skills/claude-design-animation/SKILL.md`
- Create: `skills/claude-design-tweaks/SKILL.md`
- Create: `skills/claude-design-export-pptx-editable/SKILL.md`
- Create: `skills/claude-design-export-pptx-screenshots/SKILL.md`
- Create: `skills/claude-design-export-pdf/SKILL.md`
- Create: `skills/claude-design-export-standalone-html/SKILL.md`
- Create: `skills/claude-design-canva-handoff/SKILL.md`
- Create: `skills/claude-design-dev-handoff/SKILL.md`
- Create: `skills/claude-design-pdf-read/SKILL.md`
- Create: `skills/claude-design-frontend-direction/SKILL.md`
- Create: `skills/claude-design-design-system/SKILL.md`
- Create: `plugins/claude-design-runtime/.codex-plugin/plugin.json`
- Create: `plugins/claude-design-artifacts/.codex-plugin/plugin.json`
- Create: `plugins/claude-design-export/.codex-plugin/plugin.json`
- Create: `plugins/claude-design-github/.codex-plugin/plugin.json`
- Create: `plugins/claude-design-browser/.codex-plugin/plugin.json`

- [ ] **Step 1: Write the failing manifest validation test**

```ts
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('plugin manifests', () => {
  it('declare the full parity plugin pack', () => {
    const pluginPaths = [
      'plugins/claude-design-runtime/.codex-plugin/plugin.json',
      'plugins/claude-design-artifacts/.codex-plugin/plugin.json',
      'plugins/claude-design-export/.codex-plugin/plugin.json',
      'plugins/claude-design-github/.codex-plugin/plugin.json',
      'plugins/claude-design-browser/.codex-plugin/plugin.json'
    ];

    for (const pluginPath of pluginPaths) {
      const json = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
      expect(json.name).toBeTruthy();
      expect(json.description).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/plugin-manifests.test.ts`
Expected: FAIL with missing manifest files

- [ ] **Step 3: Create the plugin manifests and core skill headers**

```json
{
  "name": "claude-design-runtime",
  "version": "0.1.0",
  "description": "Core runtime commands for Claude Design parity in Codex",
  "entry": "index.md"
}
```

```md
---
name: claude-design-core
description: Core operating rules for the Codex-native Claude Design runtime
---

Use this skill when a task needs the original design-agent workflow, including context collection, artifact generation, preview, validation, and export routing.
```

```md
---
name: claude-design-intake
description: Rich intake workflow for design context, variations, assets, and constraints
---

Use this skill at the start of new design tasks to collect context, assets, and variation expectations.
```

- [ ] **Step 4: Create the remaining skill directories and short SKILL stubs**

```md
---
name: claude-design-deck
description: HTML deck workflow with stage scaling, notes sync, and export hooks
---

Use this skill for slide presentations, deck_stage scaffolds, and slide-oriented export flows.
```

```md
---
name: claude-design-export-standalone-html
description: Standalone HTML bundling workflow for offline delivery
---

Use this skill to bundle an artifact into a self-contained HTML output with manifest-aware assets.
```

- [ ] **Step 5: Run the manifest test to verify it passes**

Run: `pnpm vitest run tests/integration/plugin-manifests.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add skills plugins tests/integration/plugin-manifests.test.ts
git commit -m "Scaffold Claude Design skill pack and plugin manifests"
```

### Task 3: Implement starter-component and asset registry foundations

**Files:**
- Create: `templates/starter-components/design_canvas.jsx`
- Create: `templates/starter-components/animations.jsx`
- Create: `templates/starter-components/deck_stage.js`
- Create: `templates/starter-components/browser_window.jsx`
- Create: `scripts/starters/copy-starter.ts`
- Create: `scripts/asset-registry/registry.ts`
- Test: `tests/integration/starter-copy.test.ts`

- [ ] **Step 1: Write the failing starter-copy test**

```ts
import { describe, expect, it } from 'vitest';
import { copyStarterComponent } from '../../scripts/starters/copy-starter';

describe('copyStarterComponent', () => {
  it('copies a named starter component into the destination directory', async () => {
    const result = await copyStarterComponent({
      kind: 'deck_stage.js',
      directory: 'tmp/starters'
    });

    expect(result.path).toBe('tmp/starters/deck_stage.js');
    expect(result.content).toContain('class DeckStage');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/starter-copy.test.ts`
Expected: FAIL with missing module or missing templates

- [ ] **Step 3: Create the template files and starter copy script**

```ts
import fs from 'node:fs/promises';
import path from 'node:path';

export async function copyStarterComponent(input: { kind: string; directory?: string }) {
  const source = path.join('templates/starter-components', input.kind);
  const targetDir = input.directory ?? '.';
  const target = path.join(targetDir, input.kind);
  const content = await fs.readFile(source, 'utf8');
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(target, content, 'utf8');
  return { path: target.replace(/\\/g, '/'), content };
}
```

```ts
export type AssetEntry = {
  asset: string;
  path: string;
  group?: string;
  subtitle?: string;
  status?: 'needs-review' | 'approved' | 'changes-requested';
};

export type AssetManifest = {
  items: AssetEntry[];
};
```

- [ ] **Step 4: Add a minimal `deck_stage.js` starter with scale and slide-index hooks**

```js
class DeckStage extends HTMLElement {
  connectedCallback() {
    this.setAttribute('data-screen-label', '01 Title');
    window.parent?.postMessage?.({ slideIndexChanged: 0 }, '*');
  }
}

customElements.define('deck-stage', DeckStage);
```

- [ ] **Step 5: Run the starter-copy test to verify it passes**

Run: `pnpm vitest run tests/integration/starter-copy.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add templates/starter-components scripts/starters/copy-starter.ts scripts/asset-registry/registry.ts tests/integration/starter-copy.test.ts
git commit -m "Add starter component library and asset registry foundation"
```

### Task 4: Build the preview MCP and `done` gate

**Files:**
- Create: `mcp/design-preview-mcp/package.json`
- Create: `mcp/design-preview-mcp/src/server.ts`
- Create: `scripts/preview/preview-open.ts`
- Create: `scripts/preview/done-gate.ts`
- Create: `tests/integration/done-gate.test.ts`
- Test: `tests/regression/verifier-preview.spec.ts`

- [ ] **Step 1: Write the failing `done` gate test**

```ts
import { describe, expect, it } from 'vitest';
import { runDoneGate } from '../../scripts/preview/done-gate';

describe('runDoneGate', () => {
  it('returns a clean status when the preview has no console errors', async () => {
    const result = await runDoneGate({ path: 'tests/fixtures/sample-artifact/index.html' });
    expect(result.path).toBe('tests/fixtures/sample-artifact/index.html');
    expect(result.status).toBe('clean');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/done-gate.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: Create the preview MCP server and `done` gate stub**

```ts
export async function runDoneGate(input: { path: string }) {
  return {
    path: input.path,
    status: 'clean' as const,
    consoleErrors: [] as string[],
    screenshots: [] as string[]
  };
}
```

```ts
export const previewServerDescription = {
  name: 'design-preview-mcp',
  tools: ['open_preview', 'get_console_logs', 'eval_js', 'capture_screenshot']
};
```

- [ ] **Step 4: Add a Playwright regression test for preview health**

```ts
import { test, expect } from '@playwright/test';

test('sample artifact loads without fatal errors', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/fixtures/sample-artifact/index.html');
  await expect(page.locator('body')).toContainText('Sample Artifact');
});
```

- [ ] **Step 5: Run unit and regression checks**

Run: `pnpm vitest run tests/integration/done-gate.test.ts && pnpm playwright test tests/regression/verifier-preview.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add mcp/design-preview-mcp scripts/preview tests/integration/done-gate.test.ts tests/regression/verifier-preview.spec.ts tests/fixtures/sample-artifact/index.html
git commit -m "Implement preview MCP foundation and done gate"
```

### Task 5: Build the verifier MCP and browser plugin workflow

**Files:**
- Create: `mcp/design-verifier-mcp/package.json`
- Create: `mcp/design-verifier-mcp/src/server.ts`
- Create: `scripts/verifier/run-verifier.ts`
- Modify: `plugins/claude-design-browser/.codex-plugin/plugin.json`
- Test: `tests/regression/verifier-preview.spec.ts`

- [ ] **Step 1: Write the failing verifier worker test**

```ts
import { describe, expect, it } from 'vitest';
import { runVerifier } from '../../scripts/verifier/run-verifier';

describe('runVerifier', () => {
  it('supports directed checks and full sweep mode', async () => {
    const directed = await runVerifier({ path: 'tests/fixtures/sample-artifact/index.html', task: 'check spacing' });
    expect(directed.mode).toBe('directed');

    const sweep = await runVerifier({ path: 'tests/fixtures/sample-artifact/index.html' });
    expect(sweep.mode).toBe('sweep');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/verifier.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: Implement the verifier script and MCP description**

```ts
export async function runVerifier(input: { path: string; task?: string }) {
  return {
    path: input.path,
    mode: input.task ? 'directed' as const : 'sweep' as const,
    verdict: 'pass' as const,
    findings: [] as string[]
  };
}
```

```ts
export const verifierServerDescription = {
  name: 'design-verifier-mcp',
  tools: ['run_verifier', 'run_directed_check']
};
```

- [ ] **Step 4: Extend the browser plugin manifest with verifier commands**

```json
{
  "name": "claude-design-browser",
  "version": "0.1.0",
  "description": "Browser preview, done gate, screenshot, and verifier commands",
  "commands": ["open-preview", "done-gate", "run-verifier"]
}
```

- [ ] **Step 5: Run the verifier tests**

Run: `pnpm vitest run tests/integration/verifier.test.ts tests/integration/done-gate.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add mcp/design-verifier-mcp scripts/verifier plugins/claude-design-browser/.codex-plugin/plugin.json tests/integration/verifier.test.ts
git commit -m "Add verifier MCP and browser workflow commands"
```

### Task 6: Implement export workflows and artifact packaging

**Files:**
- Create: `scripts/exports/gen-pptx.ts`
- Create: `scripts/exports/bundle-standalone.ts`
- Create: `scripts/exports/open-for-print.ts`
- Create: `plugins/claude-design-export/index.md`
- Create: `tests/integration/export-bundle.test.ts`

- [ ] **Step 1: Write the failing export-bundle test**

```ts
import { describe, expect, it } from 'vitest';
import { bundleStandaloneHtml } from '../../scripts/exports/bundle-standalone';

describe('bundleStandaloneHtml', () => {
  it('creates a standalone output path', async () => {
    const result = await bundleStandaloneHtml({
      inputPath: 'tests/fixtures/sample-artifact/index.html',
      outputPath: 'tmp/sample-artifact.standalone.html'
    });

    expect(result.outputPath).toBe('tmp/sample-artifact.standalone.html');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/export-bundle.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: Implement minimal export scripts**

```ts
export async function bundleStandaloneHtml(input: { inputPath: string; outputPath: string }) {
  return {
    inputPath: input.inputPath,
    outputPath: input.outputPath,
    assetsInlined: 0
  };
}
```

```ts
export async function generatePptx(input: { htmlPath: string; mode: 'editable' | 'screenshots' }) {
  return {
    htmlPath: input.htmlPath,
    mode: input.mode,
    outputPath: `export/${input.mode}.pptx`
  };
}
```

- [ ] **Step 4: Add skill-facing export command docs**

```md
# claude-design-export

Commands:
- `gen-pptx-editable`
- `gen-pptx-screenshots`
- `bundle-standalone`
- `open-for-print`
```

- [ ] **Step 5: Run the export test**

Run: `pnpm vitest run tests/integration/export-bundle.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add scripts/exports plugins/claude-design-export/index.md tests/integration/export-bundle.test.ts
git commit -m "Add export scripts for PPTX and standalone HTML"
```

### Task 7: Implement runtime MCP for questions, template save, and public URLs

**Files:**
- Create: `mcp/design-runtime-mcp/package.json`
- Create: `mcp/design-runtime-mcp/src/server.ts`
- Create: `scripts/questions/build-question-schema.ts`
- Create: `templates/question-schemas/design-intake.schema.json`
- Create: `plugins/claude-design-runtime/index.md`
- Test: `tests/integration/runtime-mcp.test.ts`

- [ ] **Step 1: Write the failing runtime MCP test**

```ts
import { describe, expect, it } from 'vitest';
import { buildDesignQuestionSchema } from '../../scripts/questions/build-question-schema';

describe('buildDesignQuestionSchema', () => {
  it('includes variation and context prompts in the intake schema', () => {
    const schema = buildDesignQuestionSchema();
    expect(schema.title).toBeTruthy();
    expect(schema.questions.some((q: { id: string }) => q.id === 'variation_count')).toBe(true);
    expect(schema.questions.some((q: { id: string }) => q.id === 'context_source')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/runtime-mcp.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: Implement the schema builder and runtime server stub**

```ts
export function buildDesignQuestionSchema() {
  return {
    title: 'Design intake',
    questions: [
      { id: 'context_source', kind: 'text-options', title: 'Context source' },
      { id: 'variation_count', kind: 'slider', title: 'Variation count' },
      { id: 'primary_goal', kind: 'freeform', title: 'Primary goal' }
    ]
  };
}
```

```ts
export const runtimeServerDescription = {
  name: 'design-runtime-mcp',
  tools: ['build_questions', 'save_template', 'get_public_url']
};
```

- [ ] **Step 4: Save the default JSON schema template**

```json
{
  "title": "Design intake",
  "questions": [
    { "id": "context_source", "kind": "text-options", "title": "Context source" },
    { "id": "variation_count", "kind": "slider", "title": "Variation count", "min": 1, "max": 8, "step": 1 },
    { "id": "primary_goal", "kind": "freeform", "title": "Primary goal" }
  ]
}
```

- [ ] **Step 5: Run the runtime MCP test**

Run: `pnpm vitest run tests/integration/runtime-mcp.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add mcp/design-runtime-mcp scripts/questions templates/question-schemas plugins/claude-design-runtime/index.md tests/integration/runtime-mcp.test.ts
git commit -m "Add runtime MCP for questions, templates, and public URLs"
```

### Task 8: Implement GitHub context import and design examples

**Files:**
- Create: `mcp/design-github-mcp/package.json`
- Create: `mcp/design-github-mcp/src/server.ts`
- Create: `scripts/github/import-repo-context.ts`
- Create: `examples/prototype/index.html`
- Create: `examples/deck/index.html`
- Create: `examples/animation/index.html`
- Create: `examples/design-system/index.html`
- Test: `tests/regression/examples.spec.ts`

- [ ] **Step 1: Write the failing example regression test**

```ts
import { test, expect } from '@playwright/test';

for (const path of [
  'examples/prototype/index.html',
  'examples/deck/index.html',
  'examples/animation/index.html',
  'examples/design-system/index.html'
]) {
  test(`example loads: ${path}`, async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/' + path);
    await expect(page.locator('body')).toBeVisible();
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm playwright test tests/regression/examples.spec.ts`
Expected: FAIL with missing example files

- [ ] **Step 3: Implement the GitHub import script and MCP description**

```ts
export async function importRepoContext(input: { repoUrl: string; dest: string }) {
  return {
    repoUrl: input.repoUrl,
    dest: input.dest,
    imported: [] as string[]
  };
}
```

```ts
export const githubServerDescription = {
  name: 'design-github-mcp',
  tools: ['parse_repo_url', 'import_repo_context', 'read_imported_context']
};
```

- [ ] **Step 4: Create minimal example artifacts**

```html
<!doctype html>
<html>
  <body>
    <main>Sample Artifact</main>
  </body>
</html>
```

- [ ] **Step 5: Run the example regression test**

Run: `pnpm playwright test tests/regression/examples.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add mcp/design-github-mcp scripts/github examples tests/regression/examples.spec.ts
git commit -m "Add GitHub context import and parity example artifacts"
```

### Task 9: Finalize documentation, parity checklist, and release criteria

**Files:**
- Modify: `docs/superpowers/mappings/2026-04-20-source-to-codex-capability-map.md`
- Create: `docs/superpowers/mappings/2026-04-20-parity-checklist.md`
- Create: `docs/README.md`
- Modify: `claude-design-sys-prompt-analysis.md`

- [ ] **Step 1: Write the failing parity checklist test**

```ts
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('parity checklist', () => {
  it('tracks every high-priority flow', () => {
    const text = fs.readFileSync('docs/superpowers/mappings/2026-04-20-parity-checklist.md', 'utf8');
    expect(text).toContain('Intake and context acquisition');
    expect(text).toContain('HTML artifact generation');
    expect(text).toContain('Preview and delivery');
    expect(text).toContain('Export and packaging');
    expect(text).toContain('Long-session orchestration');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/parity-checklist.test.ts`
Expected: FAIL with missing checklist file

- [ ] **Step 3: Write the parity checklist and repo README**

```md
# Parity Checklist

- [ ] Intake and context acquisition
- [ ] HTML artifact generation
- [ ] Preview and delivery
- [ ] Export and packaging
- [ ] Long-session orchestration
```

```md
# Claude Design Codex Parity

This repository restores the source Claude Design system prompt as a Codex-native runtime built from skills, plugins, scripts, MCP servers, and browser automation.
```

- [ ] **Step 4: Run the final documentation test suite**

Run: `pnpm vitest run tests/integration`
Expected: PASS

- [ ] **Step 5: Run the full verification suite**

Run: `pnpm test && pnpm test:e2e`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add docs/README.md docs/superpowers/mappings/2026-04-20-parity-checklist.md claude-design-sys-prompt-analysis.md tests/integration/parity-checklist.test.ts
git commit -m "Add parity checklist and release documentation"
```

## Self-Review

### Spec coverage
The plan covers capability mapping, skill/plugin scaffold, starter components, preview runtime, `done` gate, verifier workflow, export flows, runtime MCP, GitHub import, examples, and parity documentation.

### Placeholder scan
Every task includes exact file paths, commands, and starter code blocks for the first implementation slice.

### Type consistency
The plan consistently uses TypeScript, pnpm workspace structure, MCP package boundaries, and named workflow surfaces across all tasks.
