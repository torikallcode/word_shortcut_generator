import { configSchema } from './schema';
import { ConfigJsonError, ConfigValidationError, ConfigVersionError } from './errors';
import type { Command, Config, MissingTarget, Platform, Style } from './types';

export interface CatalogIndex {
  commands: Command[];
  styles: Style[];
}

export interface ParsedConfigResult {
  config: Config;
  missingTargets: MissingTarget[];
}

export function createEmptyConfig(platform: Platform): Config {
  return { version: 1, platform, bindings: [] };
}

export function serializeConfig(config: Config): string {
  return JSON.stringify(configSchema.parse(config), null, 2);
}

export function findMissingTargets(config: Config, catalog: CatalogIndex): MissingTarget[] {
  const commandIds = new Set(catalog.commands.map((command) => command.id));
  const styleIds = new Set(catalog.styles.map((style) => style.id));
  return config.bindings
    .filter((binding) => {
      if (binding.target.kind === 'command') {
        return !commandIds.has(binding.target.commandId);
      }
      return !styleIds.has(binding.target.styleId);
    })
    .map((binding) => ({ bindingId: binding.id, target: binding.target }));
}

/**
 * Loads a config file. Unknown versions are rejected outright; unknown targets are dropped
 * from the returned config and reported so the UI can warn about them.
 */
export function parseConfig(text: string, catalog: CatalogIndex): ParsedConfigResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new ConfigJsonError();
  }

  if (typeof raw === 'object' && raw !== null && 'version' in raw) {
    const version = (raw as { version?: unknown }).version;
    if (version !== 1) {
      throw new ConfigVersionError(version);
    }
  }

  const result = configSchema.safeParse(raw);
  if (!result.success) {
    throw new ConfigValidationError(result.error.issues);
  }

  const missingTargets = findMissingTargets(result.data, catalog);
  if (missingTargets.length === 0) {
    return { config: result.data, missingTargets };
  }

  const missingIds = new Set(missingTargets.map((missing) => missing.bindingId));
  return {
    config: {
      ...result.data,
      bindings: result.data.bindings.filter((binding) => !missingIds.has(binding.id)),
    },
    missingTargets,
  };
}
