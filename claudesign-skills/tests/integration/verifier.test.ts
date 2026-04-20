import { describe, expect, it } from 'vitest';

import { runVerifier } from '../../scripts/verifier/run-verifier.js';

describe('runVerifier', () => {
  it('supports directed checks and full sweep mode', async () => {
    const directed = await runVerifier({ path: 'tests/fixtures/sample-artifact/index.html', task: 'check spacing' });
    expect(directed.mode).toBe('directed');
    expect(directed.verdict).toBe('pass');

    const sweep = await runVerifier({ path: 'tests/fixtures/sample-artifact/index.html' });
    expect(sweep.mode).toBe('sweep');
    expect(sweep.verdict).toBe('pass');
  });
});
