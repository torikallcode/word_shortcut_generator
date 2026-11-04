import '@testing-library/jest-dom/vitest';

if (!('crypto' in globalThis) || typeof globalThis.crypto.randomUUID !== 'function') {
  const { webcrypto } = await import('node:crypto');
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
}
