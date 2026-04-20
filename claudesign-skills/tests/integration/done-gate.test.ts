import { describe, expect, it } from 'vitest';

import { runDoneGate } from '../../scripts/preview/done-gate.js';

describe('runDoneGate', () => {
  it('returns a clean status when the preview has no console errors', async () => {
    const result = await runDoneGate({ path: 'tests/fixtures/sample-artifact/index.html' });
    expect(result.path).toBe('tests/fixtures/sample-artifact/index.html');
    expect(result.status).toBe('clean');
    expect(result.consoleErrors).toHaveLength(0);
    expect(result.previewSessionId.startsWith('preview-')).toBe(true);
  });
});
