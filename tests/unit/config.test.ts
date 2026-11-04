import { describe, expect, it } from 'vitest';
import {
  createEmptyConfig,
  findMissingTargets,
  parseConfig,
  serializeConfig,
} from '@/domain/config';
import { ConfigJsonError, ConfigValidationError, ConfigVersionError } from '@/domain/errors';
import type { Command, Config, ShortcutBinding, Style } from '@/domain/types';

const commands: Command[] = [
  {
    id: 'bold',
    wordName: 'Bold',
    category: 'formatting',
    name: { id: 'Tebal', en: 'Bold' },
    description: { id: 'Tebalkan teks', en: 'Make text bold' },
    platforms: ['win', 'mac'],
  },
];
const styles: Style[] = [
  {
    id: 'heading-1',
    wordName: 'Heading1',
    name: { id: 'Judul 1', en: 'Heading 1' },
    platforms: ['win', 'mac'],
  },
];

const binding: ShortcutBinding = {
  id: 'b1',
  combo: { modifiers: ['ctrl', 'alt'], key: 'Digit1' },
  target: { kind: 'command', commandId: 'bold' },
};

function configWith(bindings: ShortcutBinding[]): Config {
  return { version: 1, platform: 'win', bindings };
}

describe('createEmptyConfig', () => {
  it('creates a version 1 config', () => {
    expect(createEmptyConfig('mac')).toEqual({ version: 1, platform: 'mac', bindings: [] });
  });
});

describe('serializeConfig', () => {
  it('round-trips through parseConfig', () => {
    const config = configWith([binding]);
    const parsed = parseConfig(serializeConfig(config), { commands, styles });
    expect(parsed.config).toEqual(config);
    expect(parsed.missingTargets).toEqual([]);
  });
});

describe('parseConfig', () => {
  it('rejects invalid JSON', () => {
    expect(() => parseConfig('{', { commands, styles })).toThrow(ConfigJsonError);
  });

  it('rejects unknown versions', () => {
    expect(() =>
      parseConfig(JSON.stringify({ version: 2, platform: 'win', bindings: [] }), {
        commands,
        styles,
      }),
    ).toThrow(ConfigVersionError);
  });

  it('rejects invalid schemas', () => {
    expect(() =>
      parseConfig(JSON.stringify({ version: 1, platform: 'linux', bindings: [] }), {
        commands,
        styles,
      }),
    ).toThrow(ConfigValidationError);
  });

  it('loads partially and reports missing targets', () => {
    const missingBinding: ShortcutBinding = {
      id: 'b2',
      combo: { modifiers: ['ctrl'], key: 'KeyQ' },
      target: { kind: 'command', commandId: 'not-in-catalog' },
    };
    const result = parseConfig(serializeConfig(configWith([binding, missingBinding])), {
      commands,
      styles,
    });
    expect(result.config.bindings).toEqual([binding]);
    expect(result.missingTargets).toEqual([
      { bindingId: 'b2', target: { kind: 'command', commandId: 'not-in-catalog' } },
    ]);
  });
});

describe('findMissingTargets', () => {
  it('finds missing style targets', () => {
    const missingStyle: ShortcutBinding = {
      id: 'b3',
      combo: { modifiers: ['ctrl'], key: 'KeyY' },
      target: { kind: 'style', styleId: 'unknown-style' },
    };
    expect(findMissingTargets(configWith([binding, missingStyle]), { commands, styles })).toEqual([
      { bindingId: 'b3', target: { kind: 'style', styleId: 'unknown-style' } },
    ]);
  });
});
