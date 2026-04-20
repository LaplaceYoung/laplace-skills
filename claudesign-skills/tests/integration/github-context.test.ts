import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { githubServerDescription } from '../../mcp/design-github-mcp/src/server.js';
import { importRepoContext } from '../../scripts/github/import-repo-context.js';

describe('importRepoContext', () => {
  it('writes a normalized repo-context manifest from a GitHub URL', async () => {
    const result = await importRepoContext({
      repoUrl: 'https://github.com/openai/openai-cookbook',
      dest: 'tmp/github-context'
    });

    expect(result.repoUrl).toBe('https://github.com/openai/openai-cookbook');
    expect(result.dest).toBe('tmp/github-context');
    expect(result.imported).toContain('tmp/github-context/repo-context.json');
    expect(fs.existsSync('tmp/github-context/repo-context.json')).toBe(true);

    const manifest = JSON.parse(fs.readFileSync('tmp/github-context/repo-context.json', 'utf8')) as {
      owner: string;
      repo: string;
      source: string;
    };

    expect(manifest.owner).toBe('openai');
    expect(manifest.repo).toBe('openai-cookbook');
    expect(manifest.source).toBe('github');
    expect(githubServerDescription.tools).toHaveLength(3);
  });
});
