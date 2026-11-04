import type { KeyCombo, Modifier, Platform } from './types';

const KEY_LABELS: Record<string, string> = {
  Space: 'Space',
  Enter: 'Enter',
  NumpadEnter: 'Num Enter',
  Escape: 'Esc',
  Tab: 'Tab',
  Backspace: 'Backspace',
  Delete: 'Del',
  Insert: 'Ins',
  Home: 'Home',
  End: 'End',
  PageUp: 'PgUp',
  PageDown: 'PgDn',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/',
  Backquote: '`',
  IntlBackslash: '\\',
};

const MODIFIER_LABELS: Record<Platform, Record<Modifier, string>> = {
  win: { ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift', cmd: 'Win' },
  mac: { ctrl: 'Control', alt: 'Option', shift: 'Shift', cmd: 'Command' },
};

const MODIFIER_GLYPHS: Record<Modifier, string> = {
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  cmd: '⌘',
};

export function keyLabel(code: string): string {
  if (code.startsWith('Key') && code.length === 4) {
    return code.slice(3);
  }
  if (code.startsWith('Digit') && code.length === 6) {
    return code.slice(5);
  }
  if (code.startsWith('F') && /^F\d{1,2}$/.test(code)) {
    return code;
  }
  return KEY_LABELS[code] ?? code;
}

export function modifierLabel(modifier: Modifier, platform: Platform): string {
  return MODIFIER_LABELS[platform][modifier];
}

export function modifierGlyph(modifier: Modifier): string {
  return MODIFIER_GLYPHS[modifier];
}

/** Word-style display string, e.g. `Ctrl+Alt+1` or `Command+Shift+B`. */
export function formatCombo(combo: KeyCombo, platform: Platform): string {
  return [
    ...combo.modifiers.map((modifier) => modifierLabel(modifier, platform)),
    keyLabel(combo.key),
  ].join('+');
}

export function formatComboGlyphs(combo: KeyCombo): string {
  return [...combo.modifiers.map(modifierGlyph), keyLabel(combo.key)].join('');
}

export const KEY_OPTIONS: ReadonlyArray<{ code: string; group: string }> = [
  ...Array.from({ length: 26 }, (_, index) => ({
    code: `Key${String.fromCharCode(65 + index)}`,
    group: 'letters',
  })),
  ...Array.from({ length: 10 }, (_, index) => ({ code: `Digit${index}`, group: 'digits' })),
  ...Array.from({ length: 12 }, (_, index) => ({ code: `F${index + 1}`, group: 'function' })),
  { code: 'Space', group: 'editing' },
  { code: 'Enter', group: 'editing' },
  { code: 'Tab', group: 'editing' },
  { code: 'Escape', group: 'editing' },
  { code: 'Backspace', group: 'editing' },
  { code: 'Delete', group: 'editing' },
  { code: 'Insert', group: 'editing' },
  { code: 'Home', group: 'navigation' },
  { code: 'End', group: 'navigation' },
  { code: 'PageUp', group: 'navigation' },
  { code: 'PageDown', group: 'navigation' },
  { code: 'ArrowUp', group: 'navigation' },
  { code: 'ArrowDown', group: 'navigation' },
  { code: 'ArrowLeft', group: 'navigation' },
  { code: 'ArrowRight', group: 'navigation' },
  { code: 'Minus', group: 'symbols' },
  { code: 'Equal', group: 'symbols' },
  { code: 'BracketLeft', group: 'symbols' },
  { code: 'BracketRight', group: 'symbols' },
  { code: 'Semicolon', group: 'symbols' },
  { code: 'Quote', group: 'symbols' },
  { code: 'Comma', group: 'symbols' },
  { code: 'Period', group: 'symbols' },
  { code: 'Slash', group: 'symbols' },
  { code: 'Backslash', group: 'symbols' },
  { code: 'Backquote', group: 'symbols' },
];
