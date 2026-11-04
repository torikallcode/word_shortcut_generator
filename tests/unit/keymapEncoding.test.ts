import { describe, expect, it } from 'vitest';
import { keycodeTable } from '@/data/catalog';
import { FixturesRequiredError } from '@/domain/errors';
import { KEY_OPTIONS } from '@/domain/keycodes';
import type { KeycodeTable, Style } from '@/domain/types';
import { encodeKcmPrimary, encodeStyleArgument } from '@/generator/keymapEncoding';
import { extractLatentStyleIndices, resolveStyleIndices } from '@/generator/styleIndices';

const keycodes: KeycodeTable = {
  status: 'ready',
  modifiers: { ctrl: 2, alt: 4, shift: 1 },
  keys: { KeyB: 0x42, KeyK: 0x4b, KeyT: 0x54, Digit1: 0x31, Digit2: 0x32 },
};

describe('encodeKcmPrimary', () => {
  it('matches every kcmPrimary value in the fixture', () => {
    expect(encodeKcmPrimary({ modifiers: ['ctrl'], key: 'KeyB' }, keycodes)).toBe('0242');
    expect(encodeKcmPrimary({ modifiers: ['ctrl', 'shift'], key: 'KeyB' }, keycodes)).toBe('0342');
    expect(encodeKcmPrimary({ modifiers: ['ctrl', 'alt'], key: 'Digit1' }, keycodes)).toBe('0631');
    expect(encodeKcmPrimary({ modifiers: ['ctrl', 'alt'], key: 'Digit2' }, keycodes)).toBe('0632');
    expect(encodeKcmPrimary({ modifiers: ['ctrl', 'alt'], key: 'KeyB' }, keycodes)).toBe('0642');
    expect(encodeKcmPrimary({ modifiers: ['ctrl', 'alt'], key: 'KeyK' }, keycodes)).toBe('064B');
    expect(encodeKcmPrimary({ modifiers: ['ctrl', 'alt'], key: 'KeyT' }, keycodes)).toBe('0654');
  });

  it('rejects keys that are not in the fixture-derived keycode table', () => {
    expect(() => encodeKcmPrimary({ modifiers: ['ctrl'], key: 'KeyZ' }, keycodes)).toThrow(
      FixturesRequiredError,
    );
  });

  it('rejects modifiers without an encoding', () => {
    expect(() => encodeKcmPrimary({ modifiers: ['cmd'], key: 'KeyB' }, keycodes)).toThrow(
      FixturesRequiredError,
    );
  });
});

describe('manual key options', () => {
  it('every manually selectable key has a verified Word keycode', () => {
    const missing = KEY_OPTIONS.filter(
      (option) => keycodeTable.keys[option.code] === undefined,
    ).map((option) => option.code);
    expect(missing).toEqual([]);
  });
});

describe('encodeStyleArgument', () => {
  it('matches the fixture argValues for Heading 1 and Heading 2', () => {
    expect(encodeStyleArgument(1)).toBe('AQAAAAEA');
    expect(encodeStyleArgument(2)).toBe('AQAAAAIA');
  });

  it('encodes a larger index as a little-endian uint16', () => {
    const decoded = atob(encodeStyleArgument(180));
    const bytes = [...decoded].map((character) => character.charCodeAt(0));
    expect(bytes).toEqual([1, 0, 0, 0, 180, 0]);
  });
});

describe('style indices', () => {
  it('uses the zero-based latent style order', () => {
    const xml =
      '<w:latentStyles w:count="3"><w:lsdException w:name="Normal"/><w:lsdException w:name="heading 1"/><w:lsdException w:name="heading 2"/></w:latentStyles>';
    const indices = extractLatentStyleIndices(xml);
    expect(indices.get('Normal')).toBe(0);
    expect(indices.get('heading 1')).toBe(1);
    expect(indices.get('heading 2')).toBe(2);
  });

  it('resolves catalog styles case-insensitively', () => {
    const styles: Style[] = [
      {
        id: 'caption',
        wordName: 'Caption',
        name: { id: 'Keterangan', en: 'Caption' },
        platforms: ['win'],
      },
    ];
    const indices = extractLatentStyleIndices(
      '<w:latentStyles><w:lsdException w:name="Normal"/><w:lsdException w:name="caption"/></w:latentStyles>',
    );
    expect(resolveStyleIndices(styles, indices)).toEqual({ caption: 1 });
  });
});
