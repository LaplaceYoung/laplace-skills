import { INITIAL_COMMAND_CATALOG } from './catalog.js';
import type { CommandCatalog, CommandCatalogEntry } from './types.js';

export function getCommandCatalog(): CommandCatalog {
  return INITIAL_COMMAND_CATALOG;
}

export function getCommandById(commandId: string): CommandCatalogEntry | undefined {
  return INITIAL_COMMAND_CATALOG.commands.find((command) => command.id === commandId);
}

export function getActiveCommands(): CommandCatalogEntry[] {
  return INITIAL_COMMAND_CATALOG.commands.filter((command) => command.lifecycle === 'active');
}
