import fs from 'node:fs/promises';
import path from 'node:path';

import type { CreateArtifactReq } from '../../packages/contracts/src/commands.js';

type ArtifactManifest = {
  artifactId: string;
  projectId: string;
  artifactKind: CreateArtifactReq['artifactKind'];
  entryHtml: string;
  assetIds: string[];
  createdAt: string;
};

function slugFromValue(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createArtifact(input: {
  projectId: string;
  artifactKind: CreateArtifactReq['artifactKind'];
  entryHtml: string;
  assetIds?: string[];
}) {
  const projectScope = slugFromValue(input.projectId) || 'project';
  const artifactId = `${projectScope}-${input.artifactKind}-${slugFromValue(input.entryHtml)}`;
  const artifactsRoot = path.resolve(process.cwd(), 'tmp/artifacts');
  const manifestPath = path.resolve(artifactsRoot, `${artifactId}.json`);
  const relativePath = path.relative(artifactsRoot, manifestPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`Artifact manifest path escaped artifacts root: ${manifestPath}`);
  }

  const manifest: ArtifactManifest = {
    artifactId,
    projectId: input.projectId,
    artifactKind: input.artifactKind,
    entryHtml: input.entryHtml,
    assetIds: input.assetIds ?? [],
    createdAt: new Date().toISOString()
  };

  await fs.mkdir(artifactsRoot, { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  return {
    artifactId,
    manifestPath: manifestPath.replace(/\\/g, '/'),
    createdAt: manifest.createdAt
  };
}
