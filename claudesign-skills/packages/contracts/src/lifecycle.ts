export const CONTRACT_LIFECYCLE_STATES = ['active', 'deprecated', 'sunset'] as const;

export type ContractLifecycleState = (typeof CONTRACT_LIFECYCLE_STATES)[number];

export type ContractVersionTag = `${number}.${number}.${number}`;

export interface ContractDeprecationMetadata {
  windowInMinor: number;
  windowLabel: `${number} minors`;
  replacementCommandId?: string;
}

export interface ContractLifecycleMetadata {
  state: ContractLifecycleState;
  since: ContractVersionTag;
  deprecation: ContractDeprecationMetadata;
  deprecatedSince?: ContractVersionTag;
  sunsetSince?: ContractVersionTag;
}

export const PHASE0_LIFECYCLE_FREEZE: ContractLifecycleMetadata = {
  state: 'active',
  since: '1.0.0',
  deprecation: {
    windowInMinor: 2,
    windowLabel: '2 minors'
  }
};