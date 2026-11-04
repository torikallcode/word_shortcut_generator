import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { commandCatalog, keycodeTable, styleCatalog } from '@/data/catalog';
import { loadBasePackage } from '@/data/basePackage';
import type { Config, ShortcutBinding } from '@/domain/types';
import { buildNormalDotm } from '@/generator/buildNormalDotm';
import { renderCustomizations } from '@/generator/customizations';
import { extractLatentStyleIndices, resolveStyleIndices } from '@/generator/styleIndices';

const FIXTURE = 'fixtures/win/2021/after/Normal.dotm';

/** Same shortcuts the fixture author set, in the same order Word wrote them. */
const bindings: ShortcutBinding[] = [
  {
    id: 'b1',
    combo: { modifiers: ['ctrl'], key: 'KeyB' },
    target: { kind: 'command', commandId: 'bold' },
  },
  {
    id: 'b2',
    combo: { modifiers: ['ctrl', 'shift'], key: 'KeyB' },
    target: { kind: 'command', commandId: 'bold' },
  },
  {
    id: 'b3',
    combo: { modifiers: ['ctrl', 'alt'], key: 'Digit1' },
    target: { kind: 'style', styleId: 'heading-1' },
  },
  {
    id: 'b4',
    combo: { modifiers: ['ctrl', 'alt'], key: 'Digit2' },
    target: { kind: 'style', styleId: 'heading-2' },
  },
  {
    id: 'b5',
    combo: { modifiers: ['ctrl', 'alt'], key: 'KeyB' },
    target: { kind: 'command', commandId: 'bold' },
  },
  {
    id: 'b6',
    combo: { modifiers: ['ctrl', 'alt'], key: 'KeyK' },
    target: { kind: 'command', commandId: 'insert-hyperlink' },
  },
  {
    id: 'b7',
    combo: { modifiers: ['ctrl', 'alt'], key: 'KeyT' },
    target: { kind: 'command', commandId: 'insert-table' },
  },
];

const config: Config = { version: 1, platform: 'win', bindings };

function readBlob(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

describe('fixture parity (Windows Word 2021)', () => {
  it('renders word/customizations.xml exactly like Word 2021', async () => {
    const fixtureZip = await JSZip.loadAsync(await readFile(FIXTURE));
    const expected = await fixtureZip.file('word/customizations.xml')?.async('string');
    expect(expected).toBeDefined();

    const result = await buildNormalDotm(config, {
      basePackage: await loadBasePackage(),
      renderCustomizations,
      keycodes: keycodeTable,
      commands: commandCatalog,
      styles: styleCatalog,
      defaults: [],
      browserBlocked: [],
      overrides: {},
    });

    const zip = await JSZip.loadAsync(await readBlob(result.blob));
    const actual = await zip.file('word/customizations.xml')?.async('string');
    expect(actual).toBe(expected);
  });

  it('copies every static fixture part into the generated package', async () => {
    const fixtureZip = await JSZip.loadAsync(await readFile(FIXTURE));
    const result = await buildNormalDotm(config, {
      basePackage: await loadBasePackage(),
      renderCustomizations,
      keycodes: keycodeTable,
      commands: commandCatalog,
      styles: styleCatalog,
      defaults: [],
      browserBlocked: [],
      overrides: {},
    });
    const zip = await JSZip.loadAsync(await readBlob(result.blob));

    const fixtureParts = Object.keys(fixtureZip.files)
      .filter((name) => !fixtureZip.files[name]?.dir)
      .filter((name) => name !== 'word/customizations.xml');

    for (const part of fixtureParts) {
      expect(zip.file(part), part).not.toBeNull();
    }
    expect(zip.file('word/customizations.xml')).not.toBeNull();
  });

  it('resolves every catalog style to an index in the fixture latent list', async () => {
    const basePackage = await loadBasePackage();
    const stylesPart = basePackage['word/styles.xml'];
    expect(stylesPart).toBeDefined();
    const stylesXml =
      typeof stylesPart === 'string' ? stylesPart : new TextDecoder().decode(stylesPart);

    const indices = resolveStyleIndices(styleCatalog, extractLatentStyleIndices(stylesXml));

    expect(Object.keys(indices)).toHaveLength(styleCatalog.length);
    expect(indices['heading-1']).toBe(1);
    expect(indices['heading-2']).toBe(2);
  });

  it('ships a base package with no personal metadata or AutoText', async () => {
    const basePackage = await loadBasePackage();
    expect(Object.keys(basePackage)).toHaveLength(17);

    for (const [name, content] of Object.entries(basePackage)) {
      const text = typeof content === 'string' ? content : new TextDecoder().decode(content);
      expect(text, name).not.toContain('ACER RYZEN5');
      expect(text, name).not.toContain('torikal akbar');
      expect(text, name).not.toContain('C:\\Users');
    }
  });
});
