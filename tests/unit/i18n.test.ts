import { describe, expect, it } from 'vitest';
import en from '@/i18n/en.json';
import id from '@/i18n/id.json';

function flatten(value: unknown, prefix = ''): Map<string, string> {
  const result = new Map<string, string>();
  if (typeof value !== 'object' || value === null) {
    result.set(prefix, String(value));
    return result;
  }
  for (const [key, child] of Object.entries(value)) {
    const path = prefix === '' ? key : `${prefix}.${key}`;
    for (const [childPath, childValue] of flatten(child, path)) {
      result.set(childPath, childValue);
    }
  }
  return result;
}

describe('translation parity', () => {
  const idKeys = flatten(id);
  const enKeys = flatten(en);

  it('has exactly the same keys in both languages', () => {
    expect([...idKeys.keys()].sort()).toEqual([...enKeys.keys()].sort());
  });

  it('has no empty translations', () => {
    for (const [key, value] of [...idKeys, ...enKeys]) {
      expect(value.trim(), key).not.toBe('');
    }
  });
});
