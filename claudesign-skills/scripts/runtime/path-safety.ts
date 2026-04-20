import path from 'node:path';

export const PROJECT_ROOT = path.resolve(process.cwd());

function normalizeSeparators(value: string) {
  return value.replace(/\\/g, '/');
}

export function assertWithinRoot(rootPath: string, candidatePath: string, label: string) {
  const relativePath = path.relative(rootPath, candidatePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`${label} escaped root: ${candidatePath}`);
  }

  return candidatePath;
}

export function resolveProjectPath(projectRelativePath: string, label = 'Project path') {
  const sanitizedInput = projectRelativePath.trim();

  if (sanitizedInput.length === 0) {
    throw new Error(`${label} must contain at least one visible character`);
  }

  const resolvedPath = path.resolve(PROJECT_ROOT, sanitizedInput);
  return assertWithinRoot(PROJECT_ROOT, resolvedPath, label);
}

export function resolveProjectPathOrRoot(projectRelativePath?: string) {
  const sanitizedInput = projectRelativePath?.trim() ?? '';

  if (sanitizedInput.length === 0) {
    return PROJECT_ROOT;
  }

  return resolveProjectPath(sanitizedInput, 'Download path');
}

export function toProjectRelativePath(absolutePath: string) {
  const confinedPath = assertWithinRoot(PROJECT_ROOT, absolutePath, 'Project-relative output path');
  return normalizeSeparators(path.relative(PROJECT_ROOT, confinedPath));
}

export function toPortablePath(absolutePath: string) {
  return normalizeSeparators(absolutePath);
}
