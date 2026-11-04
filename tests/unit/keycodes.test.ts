import { describe, expect, it } from 'vitest';
import { formatCombo, formatComboGlyphs, keyLabel } from '@/domain/keycodes';

describe('keyLabel', () => {
  it('strips KeyboardEvent.code prefixes', () => {
    expect(keyLabel('KeyB')).toBe('B');
    expect(keyLabel('Digit1')).toBe('1');
    expect(keyLabel('F5')).toBe('F5');
    expect(keyLabel('ArrowUp')).toBe('↑');
    expect(keyLabel('Space')).toBe('Space');
  });
});

describe('formatCombo', () => {
  it('uses Windows modifier names', () => {
    expect(formatCombo({ modifiers: ['ctrl', 'alt'], key: 'Digit1' }, 'win')).toBe('Ctrl+Alt+1');
  });

  it('uses macOS modifier names', () => {
    expect(formatCombo({ modifiers: ['cmd', 'shift'], key: 'KeyB' }, 'mac')).toBe(
      'Command+Shift+B',
    );
  });
});

describe('formatComboGlyphs', () => {
  it('renders compact glyphs', () => {
    expect(formatComboGlyphs({ modifiers: ['cmd', 'shift'], key: 'KeyB' })).toBe('⌘⇧B');
  });
});
