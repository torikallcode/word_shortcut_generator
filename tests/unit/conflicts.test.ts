import { describe, expect, it } from 'vitest';
import { comboKey, detectConflicts, normalizeCombo, unresolvedConflicts } from '@/domain/conflicts';
import type {
  BrowserBlockedCombo,
  DefaultShortcut,
  Modifier,
  ShortcutBinding,
} from '@/domain/types';

function binding(id: string, modifiers: Modifier[], key: string): ShortcutBinding {
  return { id, combo: { modifiers, key }, target: { kind: 'command', commandId: `cmd-${id}` } };
}

const defaults: DefaultShortcut[] = [
  {
    combo: { modifiers: ['ctrl'], key: 'KeyB' },
    target: { kind: 'command', wordName: 'Bold' },
    name: { id: 'Tebal', en: 'Bold' },
    platforms: ['win', 'mac'],
  },
  {
    combo: { modifiers: ['cmd'], key: 'KeyB' },
    target: { kind: 'command', wordName: 'Bold' },
    name: { id: 'Tebal', en: 'Bold' },
    platforms: ['mac'],
  },
];

const browserBlocked: BrowserBlockedCombo[] = [
  { combo: { modifiers: ['ctrl'], key: 'KeyW' }, platforms: ['win'] },
  { combo: { modifiers: ['cmd'], key: 'KeyQ' }, platforms: ['mac'] },
];

const winContext = { defaults, browserBlocked, platform: 'win' as const };
const macContext = { defaults, browserBlocked, platform: 'mac' as const };

describe('normalizeCombo', () => {
  it('deduplicates and sorts modifiers in canonical order', () => {
    expect(normalizeCombo({ modifiers: ['shift', 'ctrl', 'shift', 'alt'], key: 'Digit1' })).toEqual(
      {
        modifiers: ['ctrl', 'alt', 'shift'],
        key: 'Digit1',
      },
    );
  });

  it('produces the same key regardless of modifier order', () => {
    expect(comboKey({ modifiers: ['alt', 'ctrl'], key: 'Digit1' })).toBe(
      comboKey({ modifiers: ['ctrl', 'alt'], key: 'Digit1' }),
    );
  });
});

describe('detectConflicts', () => {
  it('returns no conflicts for a clean list', () => {
    expect(detectConflicts([binding('a', ['ctrl'], 'Digit1')], winContext)).toEqual([]);
  });

  it('flags two user bindings with the same combination', () => {
    const conflicts = detectConflicts(
      [binding('a', ['ctrl'], 'Digit1'), binding('b', ['ctrl'], 'Digit1')],
      winContext,
    );
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({
      kind: 'duplicate-binding',
      bindingIds: ['a', 'b'],
    });
  });

  it('flags a binding that collides with a Word default', () => {
    const conflicts = detectConflicts([binding('a', ['ctrl'], 'KeyB')], winContext);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({
      kind: 'default-word',
      bindingId: 'a',
      defaultShortcut: { target: { wordName: 'Bold' } },
    });
  });

  it('ignores defaults that do not apply to the selected platform', () => {
    expect(detectConflicts([binding('a', ['cmd'], 'KeyB')], winContext)).toEqual([]);
    expect(detectConflicts([binding('a', ['cmd'], 'KeyB')], macContext)).toHaveLength(1);
  });

  it('flags combinations owned by the browser', () => {
    const conflicts = detectConflicts([binding('a', ['ctrl'], 'KeyW')], winContext);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({ kind: 'browser-blocked', bindingId: 'a' });
  });
});

describe('unresolvedConflicts', () => {
  it('keeps duplicate bindings and unacknowledged Word defaults', () => {
    const conflicts = detectConflicts(
      [
        binding('a', ['ctrl'], 'Digit1'),
        binding('b', ['ctrl'], 'Digit1'),
        binding('c', ['ctrl'], 'KeyB'),
      ],
      winContext,
    );
    expect(unresolvedConflicts(conflicts, {})).toHaveLength(2);
    expect(unresolvedConflicts(conflicts, { c: true })).toHaveLength(1);
  });

  it('never blocks on browser-owned combinations', () => {
    const conflicts = detectConflicts([binding('a', ['ctrl'], 'KeyW')], winContext);
    expect(unresolvedConflicts(conflicts, {})).toEqual([]);
  });
});
