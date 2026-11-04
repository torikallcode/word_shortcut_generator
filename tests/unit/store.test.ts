import { beforeEach, describe, expect, it } from 'vitest';
import { createEmptyConfig } from '@/domain/config';
import type { Target } from '@/domain/types';
import { useAppStore } from '@/store/useAppStore';

const boldTarget: Target = { kind: 'command', commandId: 'bold' };
const italicTarget: Target = { kind: 'command', commandId: 'italic' };

beforeEach(() => {
  useAppStore.setState({ config: createEmptyConfig('win'), overrides: {} });
});

describe('useAppStore bindings', () => {
  it('adds a binding with normalized modifiers', () => {
    const id = useAppStore
      .getState()
      .addBinding(boldTarget, { modifiers: ['shift', 'ctrl', 'ctrl'], key: 'KeyB' });

    const [binding] = useAppStore.getState().config.bindings;
    expect(binding).toEqual({
      id,
      combo: { modifiers: ['ctrl', 'shift'], key: 'KeyB' },
      target: boldTarget,
    });
  });

  it('replaces the existing binding for the same target', () => {
    const store = useAppStore.getState();
    store.addBinding(boldTarget, { modifiers: ['ctrl'], key: 'KeyB' });
    store.addBinding(boldTarget, { modifiers: ['alt'], key: 'KeyI' });

    const bindings = useAppStore.getState().config.bindings;
    expect(bindings).toHaveLength(1);
    expect(bindings[0]?.combo).toEqual({ modifiers: ['alt'], key: 'KeyI' });
  });

  it('updates a binding and clears its override', () => {
    const id = useAppStore.getState().addBinding(boldTarget, { modifiers: ['ctrl'], key: 'KeyB' });
    useAppStore.getState().overrideBinding(id);
    expect(useAppStore.getState().overrides[id]).toBe(true);

    useAppStore.getState().updateBinding(id, { modifiers: ['alt'], key: 'KeyB' });
    expect(useAppStore.getState().overrides[id]).toBeUndefined();
    expect(useAppStore.getState().config.bindings[0]?.combo).toEqual({
      modifiers: ['alt'],
      key: 'KeyB',
    });
  });

  it('removes bindings and their override', () => {
    const id = useAppStore.getState().addBinding(boldTarget, { modifiers: ['ctrl'], key: 'KeyB' });
    useAppStore.getState().overrideBinding(id);
    useAppStore.getState().removeBinding(id);

    expect(useAppStore.getState().config.bindings).toEqual([]);
    expect(useAppStore.getState().overrides).toEqual({});
  });

  it('clears all bindings', () => {
    useAppStore.getState().addBinding(boldTarget, { modifiers: ['ctrl'], key: 'KeyB' });
    useAppStore.getState().addBinding(italicTarget, { modifiers: ['ctrl'], key: 'KeyI' });
    useAppStore.getState().clearBindings();
    expect(useAppStore.getState().config.bindings).toEqual([]);
  });

  it('keeps bindings but resets overrides when the platform changes', () => {
    const id = useAppStore.getState().addBinding(boldTarget, { modifiers: ['ctrl'], key: 'KeyB' });
    useAppStore.getState().overrideBinding(id);
    useAppStore.getState().setPlatform('mac');

    expect(useAppStore.getState().config.platform).toBe('mac');
    expect(useAppStore.getState().config.bindings).toHaveLength(1);
    expect(useAppStore.getState().overrides).toEqual({});
  });

  it('replaces the whole config', () => {
    useAppStore.getState().addBinding(boldTarget, { modifiers: ['ctrl'], key: 'KeyB' });
    useAppStore.getState().replaceConfig(createEmptyConfig('mac'));
    expect(useAppStore.getState().config).toEqual(createEmptyConfig('mac'));
    expect(useAppStore.getState().overrides).toEqual({});
  });
});
