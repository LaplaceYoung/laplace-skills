import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

const REQUIRED_SKILLS = [
  'claude-design-core',
  'claude-design-intake',
  'claude-design-html-artifact',
  'claude-design-prototype',
  'claude-design-deck',
  'claude-design-animation',
  'claude-design-tweaks',
  'claude-design-wireframe',
  'claude-design-export-pptx-editable',
  'claude-design-export-pptx-screenshots',
  'claude-design-export-pdf',
  'claude-design-export-standalone-html',
  'claude-design-canva-handoff',
  'claude-design-dev-handoff',
  'claude-design-pdf-read',
  'claude-design-frontend-direction',
  'claude-design-design-system'
] as const;

describe('Claude Design skill pack', () => {
  it('ships the full installable skill set', () => {
    for (const skillName of REQUIRED_SKILLS) {
      const skillPath = `skills/${skillName}/SKILL.md`;
      expect(fs.existsSync(skillPath)).toBe(true);

      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toContain(`name: ${skillName}`);
      expect(content).toContain('description:');
    }
  });

  it('declares the github plugin manifest', () => {
    const pluginPath = 'plugins/claude-design-github/.codex-plugin/plugin.json';
    expect(fs.existsSync(pluginPath)).toBe(true);

    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8')) as {
      name: string;
      commands?: string[];
    };

    expect(plugin.name).toBe('claude-design-github');
    expect(plugin.commands).toContain('connect-github');
    expect(plugin.commands).toContain('import-repo-context');
  });

  it('ships the aggregated claude-design plugin and marketplace entry', () => {
    const pluginPath = 'plugins/claude-design/.codex-plugin/plugin.json';
    expect(fs.existsSync(pluginPath)).toBe(true);

    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8')) as {
      name: string;
      commands?: string[];
    };
    const marketplace = JSON.parse(
      fs.readFileSync('.agents/plugins/marketplace.json', 'utf8')
    ) as {
      plugins: Array<{ name: string; source: { path: string } }>;
    };

    expect(plugin.name).toBe('claude-design');
    expect(plugin.commands).toContain('runtime.questions.build.v1');
    expect(plugin.commands).toContain('run-verifier');
    expect(plugin.commands).toContain('bundle-standalone');
    expect(marketplace.plugins.map((item) => item.name)).toEqual([
      'claude-design',
      'claude-design-github'
    ]);
  });
});
