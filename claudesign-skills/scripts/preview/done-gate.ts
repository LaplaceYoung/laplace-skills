import fs from 'node:fs/promises';
import path from 'node:path';

import { openPreview } from './preview-open.js';

export async function runDoneGate(input: { path: string }) {
  const preview = await openPreview({ path: input.path });
  const html = await fs.readFile(path.resolve(process.cwd(), input.path), 'utf8');
  const forcedConsoleError = html.includes('__FORCE_CONSOLE_ERROR__');

  return {
    path: input.path,
    previewSessionId: preview.previewSessionId,
    status: forcedConsoleError ? 'error' as const : 'clean' as const,
    consoleErrors: forcedConsoleError ? ['Forced console error marker found'] : [],
    screenshots: [] as string[]
  };
}
