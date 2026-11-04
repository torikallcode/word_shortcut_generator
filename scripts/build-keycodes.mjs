import { writeFileSync } from 'node:fs';

/**
 * Windows virtual-key codes (official Microsoft VK_* values). The T0 fixture confirms the
 * low byte of wne:kcmPrimary is the VK code (Digit1=0x31, KeyB=0x42, KeyK=0x4B, KeyT=0x54)
 * and the high byte modifier flags are Shift=0x01, Ctrl=0x02, Alt=0x04.
 */
const keys = {};

for (let index = 0; index < 26; index += 1) {
  keys[`Key${String.fromCharCode(65 + index)}`] = 0x41 + index;
}
for (let index = 0; index < 10; index += 1) {
  keys[`Digit${index}`] = 0x30 + index;
}
for (let index = 1; index <= 12; index += 1) {
  keys[`F${index}`] = 0x6f + index;
}

Object.assign(keys, {
  Space: 0x20,
  Enter: 0x0d,
  Tab: 0x09,
  Escape: 0x1b,
  Backspace: 0x08,
  Delete: 0x2e,
  Insert: 0x2d,
  Home: 0x24,
  End: 0x23,
  PageUp: 0x21,
  PageDown: 0x22,
  ArrowLeft: 0x25,
  ArrowUp: 0x26,
  ArrowRight: 0x27,
  ArrowDown: 0x28,
  Minus: 0xbd,
  Equal: 0xbb,
  BracketLeft: 0xdb,
  BracketRight: 0xdd,
  Backslash: 0xdc,
  Semicolon: 0xba,
  Quote: 0xde,
  Comma: 0xbc,
  Period: 0xbe,
  Slash: 0xbf,
  Backquote: 0xc0,
});

const table = {
  status: 'ready',
  modifiers: { ctrl: 2, alt: 4, shift: 1 },
  keys,
};

writeFileSync('src/data/keycodes.json', `${JSON.stringify(table, null, 2)}\n`);
console.log(`Wrote ${Object.keys(keys).length} key codes.`);
