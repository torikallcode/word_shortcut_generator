import { mkdir, writeFile } from 'node:fs/promises';
import { commandCatalog, keycodeTable, styleCatalog } from '@/data/catalog';
import { loadBasePackage } from '@/data/basePackage';
import type { Config } from '@/domain/types';
import { buildNormalDotm } from '@/generator/buildNormalDotm';
import { renderCustomizations } from '@/generator/customizations';

const config: Config = {
  version: 1,
  platform: 'win',
  bindings: [
    {
      id: 'sample-heading-1',
      combo: { modifiers: ['ctrl', 'alt'], key: 'Digit1' },
      target: { kind: 'style', styleId: 'heading-1' },
    },
    {
      id: 'sample-heading-2',
      combo: { modifiers: ['ctrl', 'alt'], key: 'Digit2' },
      target: { kind: 'style', styleId: 'heading-2' },
    },
    {
      id: 'sample-bold',
      combo: { modifiers: ['ctrl', 'alt'], key: 'KeyB' },
      target: { kind: 'command', commandId: 'bold' },
    },
    {
      id: 'sample-hyperlink',
      combo: { modifiers: ['ctrl', 'alt'], key: 'KeyK' },
      target: { kind: 'command', commandId: 'insert-hyperlink' },
    },
    {
      id: 'sample-table',
      combo: { modifiers: ['ctrl', 'alt'], key: 'KeyT' },
      target: { kind: 'command', commandId: 'insert-table' },
    },
  ],
};

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

await mkdir('fixtures/generated', { recursive: true });
const target = 'fixtures/generated/Normal.dotm';
await writeFile(target, Buffer.from(await result.blob.arrayBuffer()));

console.log(`Wrote ${target}`);
console.log(`Shortcuts: ${config.bindings.length}`);
