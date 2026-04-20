import fs from 'node:fs/promises';
import path from 'node:path';

import type { AssetInput, AssetRecord } from '../../packages/contracts/src/commands.js';

export type AssetEntry = AssetRecord & {
  label?: string;
};

export type AssetManifest = {
  projectId: string;
  items: AssetEntry[];
};

function manifestPathFor(projectId: string) {
  return path.resolve(process.cwd(), 'tmp/assets', `${projectId}-asset-manifest.json`);
}

function slugFromValue(value: string) {
  return value.replace(/[\\/]+/g, '-').replace(/[^a-zA-Z0-9.-]+/g, '-');
}

export function createAssetManifest(projectId: string, items: AssetEntry[] = []): AssetManifest {
  return { projectId, items };
}

export async function loadAssetManifest(projectId: string): Promise<AssetManifest> {
  const manifestPath = manifestPathFor(projectId);

  try {
    const content = await fs.readFile(manifestPath, 'utf8');
    return JSON.parse(content) as AssetManifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return createAssetManifest(projectId);
    }

    throw error;
  }
}

export async function saveAssetManifest(projectId: string, manifest: AssetManifest) {
  const manifestPath = manifestPathFor(projectId);
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  return manifestPath.replace(/\\/g, '/');
}

export async function registerAssets(projectId: string, assets: AssetInput[]) {
  const manifest = await loadAssetManifest(projectId);
  const nextEntries: AssetEntry[] = assets.map((asset, index) => ({
    assetId: `${projectId}-${slugFromValue(asset.path)}-${manifest.items.length + index + 1}`,
    path: asset.path,
    kind: asset.kind,
    label: asset.label
  }));

  const nextManifest = createAssetManifest(projectId, [...manifest.items, ...nextEntries]);
  const manifestPath = await saveAssetManifest(projectId, nextManifest);

  return {
    manifestPath,
    registered: nextEntries
  };
}

export async function unregisterAssets(projectId: string, assetIds: string[]) {
  const manifest = await loadAssetManifest(projectId);
  const removedAssetIds = manifest.items
    .filter((item) => assetIds.includes(item.assetId))
    .map((item) => item.assetId);

  const nextManifest = createAssetManifest(
    projectId,
    manifest.items.filter((item) => !assetIds.includes(item.assetId))
  );

  const manifestPath = await saveAssetManifest(projectId, nextManifest);

  return {
    manifestPath,
    removedAssetIds
  };
}
