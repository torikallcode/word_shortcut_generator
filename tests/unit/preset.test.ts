import { beforeEach, describe, expect, it } from 'vitest';
import {
  browserBlockedCombos,
  commandCatalog,
  defaultShortcuts,
  presets,
  styleCatalog,
} from '@/data/catalog';
import { createEmptyConfig } from '@/domain/config';
import { detectConflicts, comboKey, unresolvedConflicts } from '@/domain/conflicts';
import { useAppStore } from '@/store/useAppStore';

const skripsi = presets.find((preset) => preset.id === 'skripsi');

beforeEach(() => {
  useAppStore.setState({ config: createEmptyConfig('win'), overrides: {} });
});

describe('skripsi preset data', () => {
  it('contains 10 ready bindings and 15 planned items', () => {
    expect(skripsi).toBeDefined();
    expect(skripsi?.bindings).toHaveLength(10);
    expect(skripsi?.planned).toHaveLength(15);
  });

  it('uses unique combinations across ready and planned items', () => {
    const combos = [
      ...(skripsi?.bindings ?? []).map((binding) => comboKey(binding.combo)),
      ...(skripsi?.planned ?? []).map((item) => comboKey(item.combo)),
    ];
    expect(new Set(combos).size).toBe(combos.length);
  });

  it('only references targets that exist in the catalog', () => {
    for (const binding of skripsi?.bindings ?? []) {
      const target = binding.target;
      if (target.kind === 'command') {
        expect(commandCatalog.some((command) => command.id === target.commandId)).toBe(true);
      } else {
        expect(styleCatalog.some((style) => style.id === target.styleId)).toBe(true);
      }
    }
  });

  it('marks the Ctrl+Alt+1–3 defaults for intentional overwrite', () => {
    for (const key of ['Digit1', 'Digit2', 'Digit3']) {
      const binding = skripsi?.bindings.find((item) => item.combo.key === key);
      expect(binding?.overwriteDefault).toBe(true);
    }
  });
});

describe('applying the skripsi preset', () => {
  it('produces no unresolved conflicts when overwrite flags are honoured', () => {
    const store = useAppStore.getState();
    for (const binding of skripsi?.bindings ?? []) {
      const id = store.addBinding(binding.target, binding.combo);
      if (binding.overwriteDefault) {
        store.overrideBinding(id);
      }
    }

    const state = useAppStore.getState();
    const conflicts = detectConflicts(state.config.bindings, {
      defaults: defaultShortcuts,
      browserBlocked: browserBlockedCombos,
      platform: 'win',
    });

    expect(state.config.bindings).toHaveLength(10);
    expect(unresolvedConflicts(conflicts, state.overrides)).toEqual([]);
  });
});
