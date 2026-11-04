import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import {
  ConfigValidationError,
  FixturesRequiredError,
  InvalidCombosError,
  MissingTargetsError,
  PackageStructureError,
  UnresolvedConflictsError,
} from '@/domain/errors';
import type { Command, Config, DefaultShortcut, ShortcutBinding } from '@/domain/types';
import { buildNormalDotm } from '@/generator/buildNormalDotm';
import type { CustomizationsRenderer } from '@/generator/customizations';
import {
  CUSTOMIZATIONS_PART,
  TEMPLATE_MIME_TYPE,
  type BasePackage,
} from '@/generator/packageStructure';

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

const keycodes = {
  status: 'ready' as const,
  modifiers: { ctrl: 512, alt: 1024, shift: 256, cmd: 2048 },
  keys: { Digit1: 49, KeyB: 66 },
};

const binding: ShortcutBinding = {
  id: 'b1',
  combo: { modifiers: ['ctrl', 'alt'], key: 'Digit1' },
  target: { kind: 'command', commandId: 'bold' },
};

const config: Config = { version: 1, platform: 'win', bindings: [binding] };

const basePackage: BasePackage = {
  '[Content_Types].xml': [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Override PartName="/word/document.xml" ContentType="application/vnd.ms-word.template.macroEnabledTemplate.main+xml"/>',
    '<Override PartName="/word/customizations.xml" ContentType="application/vnd.ms-word.keyMapCustomizations+xml"/>',
    '</Types>',
  ].join(''),
  '_rels/.rels':
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>',
  'word/document.xml':
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>',
  'word/styles.xml':
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>',
  'word/settings.xml':
    '<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>',
  'word/_rels/document.xml.rels':
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId9" Type="customizations" Target="customizations.xml"/></Relationships>',
  'docProps/core.xml':
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"/>',
};

const renderer: CustomizationsRenderer = (bindings, context) =>
  `<keymap platform="${context.platform}">${bindings
    .map((item) => `<entry id="${item.id}" key="${item.combo.key}"/>`)
    .join('')}</keymap>`;

function readBlob(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

function options(overrides = {}) {
  return {
    basePackage,
    renderCustomizations: renderer,
    keycodes,
    commands,
    styles: [],
    defaults: [] as DefaultShortcut[],
    browserBlocked: [],
    ...overrides,
  };
}

describe('buildNormalDotm', () => {
  it('produces a ZIP Blob named Normal.dotm with the rendered customizations part', async () => {
    const result = await buildNormalDotm(config, options());

    expect(result.fileName).toBe('Normal.dotm');
    // Blob normalizes MIME types to lowercase; MIME types are case-insensitive.
    expect(result.blob.type.toLowerCase()).toBe(TEMPLATE_MIME_TYPE.toLowerCase());

    const zip = await JSZip.loadAsync(await readBlob(result.blob));
    expect(zip.file(CUSTOMIZATIONS_PART)).not.toBeNull();
    expect(zip.file('word/document.xml')).not.toBeNull();
    expect(zip.file('docProps/core.xml')).not.toBeNull();

    const customizations = await zip.file(CUSTOMIZATIONS_PART)?.async('string');
    expect(customizations).toBe('<keymap platform="win"><entry id="b1" key="Digit1"/></keymap>');
  });

  it('rejects an invalid config before touching the package', async () => {
    await expect(
      buildNormalDotm({ ...config, version: 2 } as unknown as Config, options()),
    ).rejects.toBeInstanceOf(ConfigValidationError);
  });

  it('stops on unresolved conflicts', async () => {
    const defaults: DefaultShortcut[] = [
      {
        combo: { modifiers: ['ctrl', 'alt'], key: 'Digit1' },
        target: { kind: 'command', wordName: 'Heading1' },
        name: { id: 'Judul 1', en: 'Heading 1' },
        platforms: ['win'],
      },
    ];
    await expect(buildNormalDotm(config, options({ defaults }))).rejects.toBeInstanceOf(
      UnresolvedConflictsError,
    );
  });

  it('proceeds when the user acknowledged the conflict', async () => {
    const defaults: DefaultShortcut[] = [
      {
        combo: { modifiers: ['ctrl', 'alt'], key: 'Digit1' },
        target: { kind: 'command', wordName: 'Heading1' },
        name: { id: 'Judul 1', en: 'Heading 1' },
        platforms: ['win'],
      },
    ];
    await expect(
      buildNormalDotm(config, options({ defaults, overrides: { b1: true } })),
    ).resolves.toBeDefined();
  });

  it('rejects Cmd combinations on Windows', async () => {
    const cmdBinding: ShortcutBinding = {
      id: 'b2',
      combo: { modifiers: ['cmd'], key: 'KeyB' },
      target: { kind: 'command', commandId: 'bold' },
    };
    await expect(
      buildNormalDotm({ ...config, bindings: [cmdBinding] }, options()),
    ).rejects.toBeInstanceOf(InvalidCombosError);
  });

  it('rejects configs with targets missing from the catalog', async () => {
    await expect(buildNormalDotm(config, options({ commands: [] }))).rejects.toBeInstanceOf(
      MissingTargetsError,
    );
  });

  it('rejects an incomplete base package', async () => {
    const incomplete = { ...basePackage };
    delete incomplete['word/settings.xml'];
    await expect(
      buildNormalDotm(config, options({ basePackage: incomplete })),
    ).rejects.toBeInstanceOf(PackageStructureError);
  });

  it('rejects a package that is not a macro-enabled template', async () => {
    const wrongType = {
      ...basePackage,
      '[Content_Types].xml': '<Types><Override PartName="/word/customizations.xml"/></Types>',
    };
    await expect(
      buildNormalDotm(config, options({ basePackage: wrongType })),
    ).rejects.toBeInstanceOf(PackageStructureError);
  });

  it('refuses to guess macOS Command-key encoding without a Mac fixture', async () => {
    await expect(buildNormalDotm({ ...config, platform: 'mac' }, options())).rejects.toBeInstanceOf(
      FixturesRequiredError,
    );
  });
});
