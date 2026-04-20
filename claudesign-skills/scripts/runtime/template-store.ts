import fs from 'node:fs/promises';
import path from 'node:path';

import { getPublicFileUrl as getEphemeralPublicFileUrl } from './public-url-server.js';

function slugFromValue(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

type TemplateManifest = {
  projectId: string;
  templateName: string;
  templateId: string;
  sourceArtifactPath: string;
  tags: string[];
  version: number;
  savedAt: string;
};

type ProjectManifest = {
  projectId: string;
  title: string;
  updatedAt: string;
};

function templateManifestPath(projectId: string, templateName: string) {
  return path.resolve(
    process.cwd(),
    'tmp/templates',
    `${slugFromValue(projectId)}-${slugFromValue(templateName)}.json`
  );
}

function projectManifestPath(projectId: string) {
  return path.resolve(process.cwd(), 'tmp/runtime/projects', `${slugFromValue(projectId)}.json`);
}

export async function saveTemplate(input: {
  projectId: string;
  templateName: string;
  sourceArtifactPath: string;
  tags?: string[];
}) {
  const manifestPath = templateManifestPath(input.projectId, input.templateName);
  let version = 1;

  try {
    const previous = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as TemplateManifest;
    version = previous.version + 1;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  const manifest: TemplateManifest = {
    projectId: input.projectId,
    templateName: input.templateName,
    templateId: `${slugFromValue(input.projectId)}:${slugFromValue(input.templateName)}`,
    sourceArtifactPath: input.sourceArtifactPath,
    tags: input.tags ?? [],
    version,
    savedAt: new Date().toISOString()
  };

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  return manifest;
}

export async function setProjectTitleManifest(input: { projectId: string; title: string }) {
  const manifestPath = projectManifestPath(input.projectId);

  try {
    const previous = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as ProjectManifest;

    if (previous.title.trim().length > 0) {
      return {
        ...previous,
        requestedTitle: input.title,
        changed: previous.title === input.title
      };
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  const manifest: ProjectManifest = {
    projectId: input.projectId,
    title: input.title,
    updatedAt: new Date().toISOString()
  };

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  return {
    ...manifest,
    requestedTitle: input.title,
    changed: true
  };
}

export async function getPublicFileUrl(filePath: string) {
  return await getEphemeralPublicFileUrl(filePath);
}
