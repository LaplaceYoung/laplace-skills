import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { reportExists, runVerifierContract } from '../../scripts/runtime/contract-adapters.js';
import { runVerifier } from '../../scripts/verifier/run-verifier.js';

describe('runVerifier', () => {
  it('supports directed checks and full sweep mode', async () => {
    const directed = await runVerifier({ path: 'tests/fixtures/sample-artifact/index.html', task: 'check spacing' });
    expect(directed.mode).toBe('directed');
    expect(directed.verdict).toBe('pass');
    expect(directed.reportPath).toContain('artifacts/verifier/verifier-');
    expect(fs.existsSync(directed.reportPath)).toBe(true);

    const sweep = await runVerifier({ path: 'tests/fixtures/sample-artifact/index.html' });
    expect(sweep.mode).toBe('sweep');
    expect(sweep.verdict).toBe('pass');
    expect(fs.existsSync(sweep.reportPath)).toBe(true);
  });

  it('returns fail verdict and issues for forced error fixtures', async () => {
    const result = await runVerifierContract({
      correlationId: 'corr-4',
      artifactId: 'artifact-1',
      mode: 'directed',
      task: 'check console',
      path: 'tests/fixtures/sample-artifact/error.html'
    });
    expect(result.commandId).toBe('verify.run.v1');
    expect(result.verdict).toBe('fail');
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]?.detail).toContain('Forced console error marker found');
    expect(result.reportPath).toContain('artifacts/verifier/verifier-');
    expect(reportExists(result.reportPath)).toBe(true);
  });
});
