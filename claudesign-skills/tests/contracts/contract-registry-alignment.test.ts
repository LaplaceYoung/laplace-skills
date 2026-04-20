import { describe, expect, it } from 'vitest';

import { INITIAL_CONTRACT_CATALOG } from '../../packages/contracts/src/index.js';
import { INITIAL_COMMAND_CATALOG } from '../../packages/command-registry/src/catalog';

describe('contracts and registry stay aligned', () => {
  it('uses the same command ids, capability names, owners, and schema type names', () => {
    const registryById = new Map(
      INITIAL_COMMAND_CATALOG.commands.map((command) => [command.id, command])
    );

    expect(INITIAL_CONTRACT_CATALOG).toHaveLength(INITIAL_COMMAND_CATALOG.commands.length);

    for (const schema of INITIAL_CONTRACT_CATALOG) {
      const registryCommand = registryById.get(schema.id);
      expect(registryCommand, `missing registry entry for ${schema.id}`).toBeDefined();
      expect(registryCommand?.capability).toBe(schema.capability);
      expect(registryCommand?.owner).toBe(schema.owner);
      expect(registryCommand?.schemas.request).toBe(schema.request.typeName);
      expect(registryCommand?.schemas.response).toBe(schema.response.typeName);
      expect(registryCommand?.lifecycle).toBe(schema.lifecycle.state);
      expect(registryCommand?.deprecationWindow).toBe(schema.lifecycle.deprecation.windowLabel);
    }
  });
});
