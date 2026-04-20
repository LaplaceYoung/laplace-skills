import { describe, expect, it } from 'vitest';

import { runVerifier } from '../../scripts/verifier/run-verifier.js';
import { runVerifierContract } from '../../scripts/runtime/contract-adapters.js';

describe('runVerifier', () => {
  it('supports directed checks and full sweep mode', async () => {
    const directed = await runVerifier({ path: 'tests/fixtures/sample-artifact/index.html', task: 'check spacing' });
    expect(directed.mode).toBe('directed');
    expect(directed.verdict).toBe('pass');

    const sweep = await runVerifier({ path: 'tests/fixtures/sample-artifact/index.html' });
    expect(sweep.mode).toBe('sweep');
    expect(sweep.verdict).toBe('pass');
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
  });
});
