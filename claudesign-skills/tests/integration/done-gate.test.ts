import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { runDoneGate } from '../../scripts/preview/done-gate.js';
import { reportExists, runDoneGateContract } from '../../scripts/runtime/contract-adapters.js';

describe('runDoneGate', () => {
  it('returns a clean status when the preview has no console errors', async () => {
    const result = await runDoneGate({ path: 'tests/fixtures/sample-artifact/index.html' });
    expect(result.path).toBe('tests/fixtures/sample-artifact/index.html');
    expect(result.status).toBe('clean');
    expect(result.consoleErrors).toHaveLength(0);
    expect(result.previewSessionId.startsWith('preview-')).toBe(true);
    expect(result.reportPath).toContain('artifacts/verifier/done-gate-');
    expect(fs.existsSync(result.reportPath)).toBe(true);
  });

  it('returns a failing contract response when console error markers exist', async () => {
    const result = await runDoneGateContract({
      correlationId: 'corr-3',
      previewSessionId: 'preview-manual',
      path: 'tests/fixtures/sample-artifact/error.html'
    });
    expect(result.commandId).toBe('verify.done_gate.v1');
    expect(result.status).toBe('fail');
    expect(result.findings).toContain('Forced console error marker found');
    expect(result.reportPath).toContain('artifacts/verifier/done-gate-');
    expect(reportExists(result.reportPath ?? '')).toBe(true);
  });
});
