export const CONTRACT_OWNERS = [
  'runtime',
  'assets',
  'artifacts',
  'preview',
  'verifier',
  'export'
] as const;

export type ContractOwner = (typeof CONTRACT_OWNERS)[number];

export const CONTRACT_ERROR_CODES = [
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
] as const;

export type ContractErrorCode = (typeof CONTRACT_ERROR_CODES)[number];

export function isContractOwner(value: string): value is ContractOwner {
  return CONTRACT_OWNERS.includes(value as ContractOwner);
}

export function isContractErrorCode(value: string): value is ContractErrorCode {
  return CONTRACT_ERROR_CODES.includes(value as ContractErrorCode);
}