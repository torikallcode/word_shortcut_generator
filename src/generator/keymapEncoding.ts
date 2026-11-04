import { FixturesRequiredError } from '@/domain/errors';
import type { KeyCombo, KeycodeTable } from '@/domain/types';

/**
 * `wne:kcmPrimary` is a 16-bit value: high byte = modifier flags, low byte = Windows
 * virtual-key code. The flag values below are taken from the T0 fixture:
 *   0x0242 = Ctrl+B, 0x0342 = Ctrl+Shift+B, 0x0642 = Ctrl+Alt+B
 * so Shift=0x01, Ctrl=0x02, Alt=0x04.
 */
export function encodeKcmPrimary(combo: KeyCombo, keycodes: KeycodeTable): string {
  const virtualKey = keycodes.keys[combo.key];
  if (virtualKey === undefined) {
    throw new FixturesRequiredError(`Word virtual-key code for ${combo.key}`);
  }

  let flags = 0;
  for (const modifier of combo.modifiers) {
    const flag = keycodes.modifiers[modifier];
    if (flag === undefined) {
      throw new FixturesRequiredError(`Word modifier flag for ${modifier}`);
    }
    flags |= flag;
  }

  return (((flags << 8) | virtualKey) >>> 0).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Style shortcuts store an `acd` argument: four bytes `01 00 00 00` followed by a
 * little-endian uint16 style index. The fixture shows Heading 1 -> 1 and Heading 2 -> 2,
 * which matches the zero-based order of `w:lsdException` entries in `word/styles.xml`.
 */
export function encodeStyleArgument(styleIndex: number): string {
  const bytes = [0x01, 0x00, 0x00, 0x00, styleIndex & 0xff, (styleIndex >> 8) & 0xff];
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
