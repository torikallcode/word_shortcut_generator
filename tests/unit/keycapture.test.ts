import { describe, expect, it } from 'vitest';
import {
  comboFromKeyboardEvent,
  isComboValidForPlatform,
  isModifierCode,
} from '@/domain/keycapture';

function keyEvent(overrides: Partial<KeyboardEvent>): KeyboardEvent {
  return {
    code: '',
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    key: '',
    ...overrides,
  } as KeyboardEvent;
}

describe('comboFromKeyboardEvent', () => {
  it('returns null while only a modifier is held', () => {
    expect(
      comboFromKeyboardEvent(keyEvent({ code: 'ControlLeft', ctrlKey: true }), 'win'),
    ).toBeNull();
  });

  it('captures Ctrl+Alt+1 on Windows', () => {
    expect(
      comboFromKeyboardEvent(keyEvent({ code: 'Digit1', ctrlKey: true, altKey: true }), 'win'),
    ).toEqual({ modifiers: ['ctrl', 'alt'], key: 'Digit1' });
  });

  it('maps Meta to Cmd on macOS', () => {
    expect(comboFromKeyboardEvent(keyEvent({ code: 'KeyB', metaKey: true }), 'mac')).toEqual({
      modifiers: ['cmd'],
      key: 'KeyB',
    });
  });

  it('ignores Meta on Windows', () => {
    expect(comboFromKeyboardEvent(keyEvent({ code: 'KeyB', metaKey: true }), 'win')).toEqual({
      modifiers: [],
      key: 'KeyB',
    });
  });

  it('normalizes modifier order', () => {
    expect(
      comboFromKeyboardEvent(
        keyEvent({ code: 'Digit2', shiftKey: true, ctrlKey: true, altKey: true }),
        'win',
      )?.modifiers,
    ).toEqual(['ctrl', 'alt', 'shift']);
  });

  it('identifies modifier key codes', () => {
    expect(isModifierCode('ShiftRight')).toBe(true);
    expect(isModifierCode('KeyA')).toBe(false);
  });
});

describe('isComboValidForPlatform', () => {
  it('rejects Cmd on Windows', () => {
    expect(isComboValidForPlatform({ modifiers: ['cmd'], key: 'KeyB' }, 'win')).toBe(false);
  });

  it('accepts Cmd on macOS', () => {
    expect(isComboValidForPlatform({ modifiers: ['cmd'], key: 'KeyB' }, 'mac')).toBe(true);
  });
});
