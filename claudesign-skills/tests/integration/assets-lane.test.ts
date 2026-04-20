import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { assetsServerDescription } from '../../mcp/design-assets-mcp/src/server.js';
import {
  registerAssetsContract,
  unregisterAssetsContract
} from '../../scripts/runtime/contract-adapters.js';

describe('asset registry contracts', () => {
  it('registers assets into a project manifest', async () => {
    const result = await registerAssetsContract({
      correlationId: 'corr-assets-1',
      projectId: 'project-assets',
      assets: [
        {
          path: 'tests/fixtures/sample-artifact/index.html',
          kind: 'other',
          label: 'sample artifact'
        }
      ]
    });

    expect(result.commandId).toBe('assets.register.v1');
    expect(result.registered).toHaveLength(1);
    expect(result.registered[0]?.assetId).toContain('project-assets');
    expect(result.registered[0]?.path).toBe('tests/fixtures/sample-artifact/index.html');
    expect(fs.existsSync('tmp/assets/project-assets-asset-manifest.json')).toBe(true);
    expect(assetsServerDescription.tools).toHaveLength(2);
  });

  it('unregisters assets from the same project manifest', async () => {
    const registered = await registerAssetsContract({
      correlationId: 'corr-assets-2',
      projectId: 'project-assets-remove',
      assets: [
        {
          path: 'tests/fixtures/sample-artifact/error.html',
          kind: 'other',
          label: 'error fixture'
        }
      ]
    });

    const removed = await unregisterAssetsContract({
      correlationId: 'corr-assets-3',
      projectId: 'project-assets-remove',
      assetIds: [registered.registered[0]!.assetId]
    });

    expect(removed.commandId).toBe('assets.unregister.v1');
    expect(removed.removedAssetIds).toEqual([registered.registered[0]!.assetId]);

    const manifest = JSON.parse(
      fs.readFileSync('tmp/assets/project-assets-remove-asset-manifest.json', 'utf8')
    ) as { items: Array<{ assetId: string }> };

    expect(manifest.items).toHaveLength(0);
  });
});
