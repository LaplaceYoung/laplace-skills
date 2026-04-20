import { describe, expect, it } from 'vitest';

import { INITIAL_COMMAND_CATALOG } from '../../packages/command-registry/src/catalog.js';

describe('command registry integrity', () => {
  it('keeps the frozen Phase 0 catalog complete and unique', () => {
    expect(INITIAL_COMMAND_CATALOG.version).toBe('1.0.0');
    expect(INITIAL_COMMAND_CATALOG.frozenAt).toBe('2026-04-20');
    expect(INITIAL_COMMAND_CATALOG.commands).toHaveLength(12);

    const ids = INITIAL_COMMAND_CATALOG.commands.map((command) => command.id);
    const capabilities = INITIAL_COMMAND_CATALOG.commands.map((command) => command.capability);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(capabilities).size).toBe(capabilities.length);
  });

  it('keeps owner, lifecycle, deprecation, and schema metadata populated', () => {
    for (const command of INITIAL_COMMAND_CATALOG.commands) {
      expect(command.owner.length).toBeGreaterThan(0);
      expect(command.lifecycle).toBe('active');
      expect(command.deprecationWindow).toBe('2 minors');
      expect(command.schemas.request.endsWith('Req')).toBe(true);
      expect(command.schemas.response.endsWith('Resp')).toBe(true);
    }
  });
});
