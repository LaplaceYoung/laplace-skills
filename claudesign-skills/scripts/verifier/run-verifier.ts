import { runDoneGate } from '../preview/done-gate.js';

export async function runVerifier(input: { path: string; task?: string }) {
  const gate = await runDoneGate({ path: input.path });
  const findings = [...gate.consoleErrors];

  return {
    path: input.path,
    mode: input.task ? 'directed' as const : 'sweep' as const,
    verdict: findings.length === 0 ? 'pass' as const : 'fail' as const,
    findings,
    task: input.task ?? null,
    previewSessionId: gate.previewSessionId
  };
}
