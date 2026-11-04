import type {
  BrowserBlockedCombo,
  DefaultShortcut,
  Modifier,
  Platform,
  ShortcutBinding,
} from './types';

const MODIFIER_ORDER: readonly Modifier[] = ['ctrl', 'alt', 'shift', 'cmd'];

export function normalizeCombo(combo: { modifiers: Modifier[]; key: string }): {
  modifiers: Modifier[];
  key: string;
} {
  const unique = new Set(combo.modifiers);
  return {
    modifiers: MODIFIER_ORDER.filter((modifier) => unique.has(modifier)),
    key: combo.key,
  };
}

/** Stable identity for a key combination, independent of modifier order. */
export function comboKey(combo: { modifiers: Modifier[]; key: string }): string {
  const normalized = normalizeCombo(combo);
  return `${normalized.modifiers.join('+')}:${normalized.key}`;
}

export function combosEqual(
  a: { modifiers: Modifier[]; key: string },
  b: { modifiers: Modifier[]; key: string },
): boolean {
  return comboKey(a) === comboKey(b);
}

export type Conflict =
  | {
      kind: 'duplicate-binding';
      comboKey: string;
      bindingIds: string[];
    }
  | {
      kind: 'default-word';
      comboKey: string;
      bindingId: string;
      defaultShortcut: DefaultShortcut;
    }
  | {
      kind: 'browser-blocked';
      comboKey: string;
      bindingId: string;
      blocked: BrowserBlockedCombo;
    };

export interface ConflictContext {
  defaults: DefaultShortcut[];
  browserBlocked: BrowserBlockedCombo[];
  platform: Platform;
}

/**
 * Pure conflict detection.
 *
 * - `duplicate-binding`: two user bindings share a combination (must be fixed).
 * - `default-word`: the combination already exists in Word (user must overwrite or change).
 * - `browser-blocked`: the browser cannot intercept the combination; manual input is the
 *   only way to set it, but the binding is still exportable.
 */
export function detectConflicts(bindings: ShortcutBinding[], context: ConflictContext): Conflict[] {
  const conflicts: Conflict[] = [];

  const byCombo = new Map<string, string[]>();
  for (const binding of bindings) {
    const key = comboKey(binding.combo);
    const ids = byCombo.get(key);
    if (ids) {
      ids.push(binding.id);
    } else {
      byCombo.set(key, [binding.id]);
    }
  }
  for (const [key, ids] of byCombo) {
    if (ids.length > 1) {
      conflicts.push({ kind: 'duplicate-binding', comboKey: key, bindingIds: ids });
    }
  }

  const defaultsByCombo = new Map<string, DefaultShortcut>();
  for (const shortcut of context.defaults) {
    if (shortcut.platforms.includes(context.platform)) {
      defaultsByCombo.set(comboKey(shortcut.combo), shortcut);
    }
  }

  const blockedByCombo = new Map<string, BrowserBlockedCombo>();
  for (const blocked of context.browserBlocked) {
    if (blocked.platforms.includes(context.platform)) {
      blockedByCombo.set(comboKey(blocked.combo), blocked);
    }
  }

  for (const binding of bindings) {
    const key = comboKey(binding.combo);
    const defaultShortcut = defaultsByCombo.get(key);
    if (defaultShortcut) {
      conflicts.push({
        kind: 'default-word',
        comboKey: key,
        bindingId: binding.id,
        defaultShortcut,
      });
    }
    const blocked = blockedByCombo.get(key);
    if (blocked) {
      conflicts.push({ kind: 'browser-blocked', comboKey: key, bindingId: binding.id, blocked });
    }
  }

  return conflicts;
}

export function conflictsForBindings(conflicts: Conflict[], bindingIds: string[]): Conflict[] {
  const ids = new Set(bindingIds);
  return conflicts.filter((conflict) => {
    if (conflict.kind === 'duplicate-binding') {
      return conflict.bindingIds.some((id) => ids.has(id));
    }
    return ids.has(conflict.bindingId);
  });
}

/** Overrides are keyed by binding id; the user acknowledges taking over a Word default. */
export function unresolvedConflicts(
  conflicts: Conflict[],
  overrides: Readonly<Record<string, boolean>>,
): Conflict[] {
  return conflicts.filter((conflict) => {
    if (conflict.kind === 'browser-blocked') {
      return false;
    }
    if (conflict.kind === 'duplicate-binding') {
      return true;
    }
    return overrides[conflict.bindingId] !== true;
  });
}
