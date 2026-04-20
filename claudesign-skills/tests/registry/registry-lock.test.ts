import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { INITIAL_COMMAND_CATALOG } from '../../packages/command-registry/src/catalog';

describe('registry lock contract', () => {
  it('matches the source command catalog exactly', () => {
    const lockPath = path.resolve(process.cwd(), 'artifacts/contracts/registry-lock.json');
    const lock = JSON.parse(readFileSync(lockPath, 'utf8')) as {
      registryVersion: string;
      frozenAt: string;
      commandCount: number;
      commands: unknown[];
      commandsSha256: string;
    };

    expect(lock.registryVersion).toBe(INITIAL_COMMAND_CATALOG.version);
    expect(lock.frozenAt).toBe(INITIAL_COMMAND_CATALOG.frozenAt);
    expect(lock.commands).toEqual(INITIAL_COMMAND_CATALOG.commands);
    expect(lock.commandCount).toBe(INITIAL_COMMAND_CATALOG.commands.length);

    const expectedHash = createHash('sha256')
      .update(JSON.stringify(lock.commands))
      .digest('hex');

    expect(lock.commandsSha256).toBe(expectedHash);
  });
});
