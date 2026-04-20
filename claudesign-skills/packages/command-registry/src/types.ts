export type CommandLifecycle = 'active' | 'deprecated' | 'sunset';

export type CommandOwner =
  | 'runtime'
  | 'assets'
  | 'artifacts'
  | 'preview'
  | 'verifier'
  | 'export';

export interface CommandSchemas {
  request: string;
  response: string;
}

export interface CommandCatalogEntry {
  id: string;
  capability: string;
  owner: CommandOwner;
  lifecycle: CommandLifecycle;
  deprecationWindow: string;
  schemas: CommandSchemas;
}

export interface CommandCatalog {
  version: string;
  frozenAt: string;
  commands: CommandCatalogEntry[];
}
