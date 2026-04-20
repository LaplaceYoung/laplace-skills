import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { runDoneGate } from '../../scripts/preview/done-gate.js';

const EXAMPLE_CASES = [
  {
    path: 'examples/prototype/index.html',
    text: 'Claude Design Prototype Example'
  },
  {
    path: 'examples/deck/index.html',
    text: 'Claude Design Deck Example'
  },
  {
    path: 'examples/animation/index.html',
    text: 'Claude Design Animation Example'
  },
  {
    path: 'examples/design-system/index.html',
    text: 'Claude Design Design System Example'
  },
  {
    path: 'examples/yang-meng-profile/index.html',
    text: '模态跃迁'
  }
] as const;

describe('example artifacts', () => {
  for (const example of EXAMPLE_CASES) {
    it(`ships a clean previewable artifact: ${example.path}`, async () => {
      expect(fs.existsSync(example.path)).toBe(true);
      expect(fs.readFileSync(example.path, 'utf8')).toContain(example.text);

      const result = await runDoneGate({ path: example.path });
      expect(result.status).toBe('clean');
      expect(result.reportPath).toContain('artifacts/verifier/done-gate-');
      expect(fs.existsSync(result.reportPath)).toBe(true);
    });
  }
});
