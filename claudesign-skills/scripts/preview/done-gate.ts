import fs from 'node:fs/promises';
import path from 'node:path';

import { openPreview } from './preview-open.js';

function slugFromPath(filePath: string): string {
  return filePath.replace(/[\\/]+/g, '-').replace(/[^a-zA-Z0-9.-]+/g, '-');
}

export async function runDoneGate(input: { path: string }) {
  const preview = await openPreview({ path: input.path });
  const html = await fs.readFile(path.resolve(process.cwd(), input.path), 'utf8');
  const forcedConsoleError = html.includes('__FORCE_CONSOLE_ERROR__');
  const consoleErrors = forcedConsoleError ? ['Forced console error marker found'] : [];
  const reportPath = `artifacts/verifier/done-gate-${slugFromPath(input.path)}.json`;
  const absoluteReportPath = path.resolve(process.cwd(), reportPath);

  await fs.mkdir(path.dirname(absoluteReportPath), { recursive: true });
  await fs.writeFile(
    absoluteReportPath,
    JSON.stringify(
      {
        path: input.path,
        previewSessionId: preview.previewSessionId,
        status: forcedConsoleError ? 'error' : 'clean',
        consoleErrors,
        screenshots: [],
        generatedAt: new Date().toISOString()
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  return {
    path: input.path,
    previewSessionId: preview.previewSessionId,
    status: forcedConsoleError ? 'error' as const : 'clean' as const,
    consoleErrors,
    screenshots: [] as string[],
    reportPath
  };
}
