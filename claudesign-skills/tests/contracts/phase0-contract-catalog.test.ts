import { describe, expect, it } from 'vitest';

import {
  CONTRACT_ERROR_CODES,
  CONTRACT_OWNERS,
  INITIAL_CONTRACT_CATALOG,
  INITIAL_CONTRACT_COMMAND_IDS,
  type ContractErrorCode,
  type ContractOwner,
  isContractErrorCode,
  isContractOwner
} from '../../packages/contracts/src/index.js';

const EXPECTED_COMMAND_IDS = [
  'runtime.questions.build.v1',
  'runtime.template.save.v1',
  'assets.register.v1',
  'assets.unregister.v1',
  'artifact.create.v1',
  'preview.open.v1',
  'preview.inspect.v1',
  'verify.done_gate.v1',
  'verify.run.v1',
  'export.pptx.v1',
  'export.bundle_html.v1',
  'export.pdf_print.v1'
] as const;

describe('phase0 command schemas', () => {
  it('includes a command schema for each consensus command ID', () => {
    expect(new Set(INITIAL_CONTRACT_COMMAND_IDS)).toEqual(new Set(EXPECTED_COMMAND_IDS));

    for (const commandId of EXPECTED_COMMAND_IDS) {
      const schema = INITIAL_CONTRACT_CATALOG.find((entry) => entry.id === commandId);
      expect(schema, `missing schema for ${commandId}`).toBeDefined();
      expect(schema?.request.typeName).toMatch(/Req$/);
      expect(schema?.response.typeName).toMatch(/Resp$/);
      expect(schema?.request.required.length).toBeGreaterThan(0);
      expect(schema?.response.required.length).toBeGreaterThan(0);
    }
  });

  it('represents lifecycle and deprecation metadata on every command schema', () => {
    for (const schema of INITIAL_CONTRACT_CATALOG) {
      expect(schema.lifecycle.state).toBe('active');
      expect(schema.lifecycle.since).toMatch(/^\d+\.\d+\.\d+$/);
      expect(schema.lifecycle.deprecation.windowInMinor).toBe(2);
      expect(schema.lifecycle.deprecation.windowLabel).toBe('2 minors');
      expect(schema.correlationId).toBe('required-in-out');
    }
  });

  it('exports contract owner typing and error taxonomy typing', () => {
    const typedOwner: ContractOwner = 'runtime';
    const typedError: ContractErrorCode = 'VALIDATION';

    expect(CONTRACT_OWNERS).toEqual([
      'runtime',
      'assets',
      'artifacts',
      'preview',
      'verifier',
      'export'
    ]);
    expect(CONTRACT_ERROR_CODES).toEqual([
      'VALIDATION',
      'CONTRACT_VERSION',
      'CONFLICT',
      'IO',
      'STATE',
      'ENGINE',
      'TIMEOUT',
      'ASSERTION',
      'EXPORT',
      'INTERNAL'
    ]);

    expect(isContractOwner(typedOwner)).toBe(true);
    expect(isContractOwner('preview')).toBe(true);
    expect(isContractErrorCode(typedError)).toBe(true);
    expect(isContractErrorCode('ENGINE')).toBe(true);
  });
});