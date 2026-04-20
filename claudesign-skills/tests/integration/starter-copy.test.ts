import fs from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { copyStarterComponent } from '../../scripts/starters/copy-starter.js';

describe('copyStarterComponent', () => {
  it('copies a named starter component into the destination directory', async () => {
    const directory = 'tmp/itest-starters';
    const result = await copyStarterComponent({
      kind: 'deck_stage.js',
      directory
    });

    expect(result.path).toBe('tmp/itest-starters/deck_stage.js');
    expect(result.content).toContain('class DeckStage');

    await fs.rm(path.join(process.cwd(), directory), { recursive: true, force: true });
  });
});
