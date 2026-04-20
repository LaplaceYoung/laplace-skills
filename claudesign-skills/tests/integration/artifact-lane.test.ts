import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createArtifactContract } from '../../scripts/runtime/contract-adapters.js';

describe('artifact manifest contracts', () => {
  it('creates a persisted artifact manifest for a design artifact', async () => {
    const result = await createArtifactContract({
      correlationId: 'corr-artifact-1',
      projectId: 'project-artifact',
      artifactKind: 'prototype',
      entryHtml: 'examples/prototype/index.html',
      assetIds: ['asset-1', 'asset-2']
    });

    expect(result.commandId).toBe('artifact.create.v1');
    expect(result.artifactId).toContain('project-artifact');
    expect(result.manifestPath).toContain('tmp/artifacts/');
    expect(fs.existsSync(result.manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(result.manifestPath, 'utf8')) as {
      artifactKind: string;
      entryHtml: string;
      assetIds: string[];
    };

    expect(manifest.artifactKind).toBe('prototype');
    expect(manifest.entryHtml).toBe('examples/prototype/index.html');
    expect(manifest.assetIds).toEqual(['asset-1', 'asset-2']);
  });

  it('keeps artifact manifests confined under tmp/artifacts for traversal-like project ids', async () => {
    const result = await createArtifactContract({
      correlationId: 'corr-artifact-2',
      projectId: '../escape-attempt',
      artifactKind: 'deck',
      entryHtml: 'examples/deck/index.html'
    });

    expect(result.commandId).toBe('artifact.create.v1');
    expect(result.manifestPath).toContain('tmp/artifacts/');
    expect(result.manifestPath).not.toContain('../');
    expect(result.artifactId).toContain('escape-attempt');
    expect(fs.existsSync(result.manifestPath)).toBe(true);
  });
});
