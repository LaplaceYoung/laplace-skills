import fs from 'node:fs/promises';
import path from 'node:path';

import JSZip from 'jszip';

import {
  PROJECT_ROOT,
  resolveProjectPathOrRoot,
  toPortablePath,
  toProjectRelativePath
} from '../runtime/path-safety.js';

type DownloadKind = 'file' | 'folder' | 'project';
const PROJECT_ZIP_EXCLUDES = new Set(['.git', 'artifacts', 'node_modules', 'dist', 'tmp', 'test-results']);

async function addDirectoryToZip(zip: JSZip, absoluteDirectoryPath: string, prefix = ''): Promise<void> {
  const entries = await fs.readdir(absoluteDirectoryPath, { withFileTypes: true });

  for (const entry of entries) {
    if (prefix.length === 0 && PROJECT_ZIP_EXCLUDES.has(entry.name)) {
      continue;
    }

    const absoluteEntryPath = path.join(absoluteDirectoryPath, entry.name);
    const relativeEntryPath = prefix.length > 0 ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      await addDirectoryToZip(zip, absoluteEntryPath, relativeEntryPath);
      continue;
    }

    const bytes = await fs.readFile(absoluteEntryPath);
    zip.file(relativeEntryPath, bytes);
  }
}

async function zipDirectory(absoluteDirectoryPath: string, absoluteOutputPath: string) {
  const zip = new JSZip();

  await addDirectoryToZip(zip, absoluteDirectoryPath);
  const bytes = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  await fs.mkdir(path.dirname(absoluteOutputPath), { recursive: true });
  await fs.writeFile(absoluteOutputPath, bytes);
}

function defaultLabel(kind: DownloadKind, absolutePath: string) {
  if (kind === 'project') {
    return 'Project';
  }

  return path.basename(absolutePath);
}

export async function presentFsItemForDownload(input?: { path?: string; label?: string }) {
  const absolutePath = resolveProjectPathOrRoot(input?.path);
  const stats = await fs.stat(absolutePath);
  const kind: DownloadKind =
    absolutePath === PROJECT_ROOT ? 'project' : stats.isDirectory() ? 'folder' : 'file';
  const outputPath =
    kind === 'file'
      ? absolutePath
      : path.resolve(
          PROJECT_ROOT,
          'tmp/downloads',
          `${kind === 'project' ? 'project' : path.basename(absolutePath)}.zip`
        );

  if (kind !== 'file') {
    await zipDirectory(absolutePath, outputPath);
  }

  return {
    itemKind: kind,
    label: input?.label?.trim() || defaultLabel(kind, absolutePath),
    sourcePath: absolutePath === PROJECT_ROOT ? '' : toProjectRelativePath(absolutePath),
    downloadPath: toProjectRelativePath(outputPath),
    absoluteDownloadPath: toPortablePath(outputPath),
    exists: true
  };
}
