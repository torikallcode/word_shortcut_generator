import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { detectLanguage } from '@/i18n';
import { createEmptyConfig } from '@/domain/config';
import { normalizeCombo } from '@/domain/conflicts';
import type { Config, KeyCombo, Language, Platform, ShortcutBinding, Target } from '@/domain/types';

export const STORE_KEY = 'word-shortcut-builder.store';

function createBindingId(): string {
  const cryptoObject = globalThis.crypto;
  if (cryptoObject && typeof cryptoObject.randomUUID === 'function') {
    return cryptoObject.randomUUID();
  }
  return `binding-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sameTarget(a: Target, b: Target): boolean {
  if (a.kind === 'command' && b.kind === 'command') {
    return a.commandId === b.commandId;
  }
  if (a.kind === 'style' && b.kind === 'style') {
    return a.styleId === b.styleId;
  }
  return false;
}

interface AppState {
  config: Config;
  overrides: Record<string, boolean>;
  language: Language;
  setLanguage: (language: Language) => void;
  setPlatform: (platform: Platform) => void;
  addBinding: (target: Target, combo: KeyCombo) => string;
  updateBinding: (id: string, combo: KeyCombo) => void;
  removeBinding: (id: string) => void;
  clearBindings: () => void;
  overrideBinding: (id: string) => void;
  replaceConfig: (config: Config) => void;
  reset: (platform?: Platform) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      config: createEmptyConfig('win'),
      overrides: {},
      language: detectLanguage(),

      setLanguage: (language) => set({ language }),

      setPlatform: (platform) =>
        set((state) => ({
          config: { ...state.config, platform },
          overrides: {},
        })),

      addBinding: (target, combo) => {
        const id = createBindingId();
        set((state) => {
          const remaining = state.config.bindings.filter(
            (binding) => !sameTarget(binding.target, target),
          );
          const binding: ShortcutBinding = {
            id,
            combo: normalizeCombo(combo),
            target,
          };
          return { config: { ...state.config, bindings: [...remaining, binding] } };
        });
        return id;
      },

      updateBinding: (id, combo) =>
        set((state) => {
          const overrides = { ...state.overrides };
          delete overrides[id];
          return {
            config: {
              ...state.config,
              bindings: state.config.bindings.map((binding) =>
                binding.id === id ? { ...binding, combo: normalizeCombo(combo) } : binding,
              ),
            },
            overrides,
          };
        }),

      removeBinding: (id) =>
        set((state) => {
          const overrides = { ...state.overrides };
          delete overrides[id];
          return {
            config: {
              ...state.config,
              bindings: state.config.bindings.filter((binding) => binding.id !== id),
            },
            overrides,
          };
        }),

      clearBindings: () =>
        set((state) => ({ config: { ...state.config, bindings: [] }, overrides: {} })),

      overrideBinding: (id) => set((state) => ({ overrides: { ...state.overrides, [id]: true } })),

      replaceConfig: (config) => set({ config, overrides: {} }),

      reset: (platform) =>
        set((state) => ({
          config: createEmptyConfig(platform ?? state.config.platform),
          overrides: {},
        })),
    }),
    {
      name: STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
        overrides: state.overrides,
        language: state.language,
      }),
    },
  ),
);
