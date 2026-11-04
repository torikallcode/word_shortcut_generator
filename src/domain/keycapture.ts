import { normalizeCombo } from './conflicts';
import type { KeyCombo, Modifier, Platform } from './types';

const MODIFIER_CODES = new Set([
  'ControlLeft',
  'ControlRight',
  'AltLeft',
  'AltRight',
  'ShiftLeft',
  'ShiftRight',
  'MetaLeft',
  'MetaRight',
  'OSLeft',
  'OSRight',
  'CapsLock',
  'NumLock',
  'ScrollLock',
]);

export function isModifierCode(code: string): boolean {
  return MODIFIER_CODES.has(code);
}

/**
 * Translates a browser keyboard event into a Word-oriented key combination.
 * Returns `null` while the user is only holding a modifier key.
 */
export function comboFromKeyboardEvent(
  event: Pick<KeyboardEvent, 'code' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>,
  platform: Platform,
): KeyCombo | null {
  if (event.code === '' || isModifierCode(event.code)) {
    return null;
  }

  const modifiers: Modifier[] = [];
  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.altKey) modifiers.push('alt');
  if (event.shiftKey) modifiers.push('shift');
  if (platform === 'mac' && event.metaKey) modifiers.push('cmd');

  return normalizeCombo({ modifiers, key: event.code });
}

/** True when the modifier set is meaningful for the selected platform. */
export function isComboValidForPlatform(combo: KeyCombo, platform: Platform): boolean {
  if (combo.modifiers.includes('cmd') && platform !== 'mac') {
    return false;
  }
  return combo.key.length > 0;
}
