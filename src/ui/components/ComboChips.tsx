import { keyLabel, modifierLabel } from '@/domain/keycodes';
import type { KeyCombo, Platform } from '@/domain/types';

interface ComboChipsProps {
  combo: KeyCombo;
  platform: Platform;
}

export function ComboChips({ combo, platform }: ComboChipsProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {combo.modifiers.map((modifier) => (
        <kbd key={modifier} className="kbd">
          {modifierLabel(modifier, platform)}
        </kbd>
      ))}
      <kbd className="kbd">{keyLabel(combo.key)}</kbd>
    </span>
  );
}
