import fs from 'node:fs/promises';
import path from 'node:path';

import { runDoneGate } from '../preview/done-gate.js';

function slugFromInput(filePath: string, task?: string): string {
  const base = `${filePath}-${task ?? 'sweep'}`;
  return base.replace(/[\\/]+/g, '-').replace(/[^a-zA-Z0-9.-]+/g, '-');
}

export async function runVerifier(input: { path: string; task?: string }) {
  const gate = await runDoneGate({ path: input.path });
  const findings = [...gate.consoleErrors];
  const reportPath = `artifacts/verifier/verifier-${slugFromInput(input.path, input.task)}.json`;
  const absoluteReportPath = path.resolve(process.cwd(), reportPath);
  const verdict = findings.length === 0 ? 'pass' as const : 'fail' as const;

  await fs.mkdir(path.dirname(absoluteReportPath), { recursive: true });
  await fs.writeFile(
    absoluteReportPath,
    JSON.stringify(
      {
        path: input.path,
        mode: input.task ? 'directed' : 'sweep',
        verdict,
        findings,
        task: input.task ?? null,
        previewSessionId: gate.previewSessionId,
        doneGateReportPath: gate.reportPath,
        generatedAt: new Date().toISOString()
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  return {
    path: input.path,
    mode: input.task ? 'directed' as const : 'sweep' as const,
    verdict,
    findings,
    task: input.task ?? null,
    previewSessionId: gate.previewSessionId,
    reportPath
  };
}
