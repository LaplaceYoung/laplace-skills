import fs from 'node:fs/promises';
import path from 'node:path';

export async function openPreview(input: { path: string }) {
  const absolutePath = path.resolve(process.cwd(), input.path);
  const html = await fs.readFile(absolutePath, 'utf8');
  return {
    path: input.path,
    absolutePath,
    previewSessionId: `preview-${Buffer.from(input.path).toString('hex').slice(0, 12)}`,
    status: html.length > 0 ? 'opened' as const : 'empty' as const
  };
}
