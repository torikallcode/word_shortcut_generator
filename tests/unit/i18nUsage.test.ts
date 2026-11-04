import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/i18n/en.json';
import id from '@/i18n/id.json';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix === '' ? key : `${prefix}.${key}`),
  );
}

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [fullPath] : [];
  });
}

function literalKeys(): Set<string> {
  const keys = new Set<string>();
  for (const file of walk(join(process.cwd(), 'src'))) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) {
      if (match[1]) {
        keys.add(match[1]);
      }
    }
    for (const match of source.matchAll(/'(errors\.[A-Za-z]+)'/g)) {
      if (match[1]) {
        keys.add(match[1]);
      }
    }
  }
  return keys;
}

const DYNAMIC_KEYS = [
  ...['win', 'mac'].map((value) => `platform.${value}`),
  ...['commands', 'styles'].map((value) => `editor.tabs.${value}`),
  ...['win', 'mac'].map((value) => `guide.tabs.${value}`),
  ...['backup', 'close', 'copy', 'paste', 'restart'].flatMap((step) => [
    `guide.steps.${step}.title`,
    `guide.steps.${step}.body`,
  ]),
  ...['blocked', 'wordOpen', 'otherCopy', 'onedrive', 'macPath'].map(
    (item) => `guide.troubleItems.${item}`,
  ),
  ...['ctrl', 'alt', 'shift', 'cmd'].map((modifier) => `shortcut.modifiers.${modifier}`),
];

describe('translation key usage', () => {
  const enKeys = new Set(flattenKeys(en));
  const idKeys = new Set(flattenKeys(id));

  it('every key used in source exists in both languages', () => {
    const used = [...literalKeys(), ...DYNAMIC_KEYS];
    const missing = used.filter((key) => !enKeys.has(key) || !idKeys.has(key));
    expect([...new Set(missing)].sort()).toEqual([]);
  });
});
