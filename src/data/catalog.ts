import {
  browserBlockedListSchema,
  commandCatalogSchema,
  defaultShortcutListSchema,
  keycodeTableSchema,
  presetListSchema,
  styleCatalogSchema,
} from '@/domain/schema';
import type { KeycodeTable } from '@/domain/types';
import browserBlockedRaw from './browser-blocked.json';
import commandsRaw from './commands.json';
import defaultsRaw from './default-shortcuts.json';
import keycodesRaw from './keycodes.json';
import legalPreset from './presets/legal.json';
import academicPreset from './presets/academic.json';
import publishingPreset from './presets/publishing.json';
import stylesRaw from './styles.json';

/**
 * All catalog data is derived from the T0 fixtures (see `fixtures/README.md` and
 * `docs/ooxml-spec.md`). Until those fixtures exist the catalogs are intentionally empty:
 * guessing internal Word command/style names would produce files that Word rejects.
 */
export const commandCatalog = commandCatalogSchema.parse(commandsRaw);
export const styleCatalog = styleCatalogSchema.parse(stylesRaw);
export const defaultShortcuts = defaultShortcutListSchema.parse(defaultsRaw);
export const browserBlockedCombos = browserBlockedListSchema.parse(browserBlockedRaw);
export const presets = presetListSchema.parse([academicPreset, publishingPreset, legalPreset]);
export const keycodeTable: KeycodeTable = keycodeTableSchema.parse(keycodesRaw);

export const catalogReady = commandCatalog.length > 0 || styleCatalog.length > 0;
export const keycodesReady = keycodeTable.status === 'ready';
