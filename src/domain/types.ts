export type Platform = 'win' | 'mac';

export type Modifier = 'ctrl' | 'alt' | 'shift' | 'cmd';

export type Language = 'id' | 'en';

/**
 * `key` is a `KeyboardEvent.code` value, e.g. `Digit1`, `KeyB`, `F5`.
 * Word key codes are resolved from `src/data/keycodes.json` (fixtures T0/T4).
 */
export interface KeyCombo {
  modifiers: Modifier[];
  key: string;
}

export type Target = { kind: 'command'; commandId: string } | { kind: 'style'; styleId: string };

export interface ShortcutBinding {
  id: string;
  combo: KeyCombo;
  target: Target;
}

export interface MissingTarget {
  bindingId: string;
  target: Target;
}

export interface LocalizedText {
  id: string;
  en: string;
}

export interface Command {
  id: string;
  /** Internal Word command name, taken from the T0 fixture only. */
  wordName: string;
  category: string;
  name: LocalizedText;
  description: LocalizedText;
  platforms: Platform[];
}

export interface Style {
  id: string;
  /** Internal Word style id, taken from the T0 fixture only. */
  wordName: string;
  name: LocalizedText;
  platforms: Platform[];
}

export interface DefaultShortcut {
  combo: KeyCombo;
  target: { kind: 'command' | 'style'; wordName: string };
  name: LocalizedText;
  platforms: Platform[];
}

export interface Config {
  version: 1;
  platform: Platform;
  bindings: ShortcutBinding[];
}

export interface Preset {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  bindings: Array<{ combo: KeyCombo; target: Target }>;
}

export interface BrowserBlockedCombo {
  combo: KeyCombo;
  platforms: Platform[];
}

/** Maps a `KeyboardEvent.code` to the numeric Word key code recorded in T0 fixtures. */
export interface KeycodeTable {
  status: 'pending-t0' | 'ready';
  modifiers: Partial<Record<Modifier, number>>;
  keys: Record<string, number>;
}
