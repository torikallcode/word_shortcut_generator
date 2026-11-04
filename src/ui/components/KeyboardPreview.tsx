import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { keyLabel } from '@/domain/keycodes';
import type { Modifier } from '@/domain/types';
import { useAppStore } from '@/store/useAppStore';

const ROWS: string[][] = [
  ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  [
    'Backquote',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Minus',
    'Equal',
    'Backspace',
  ],
  [
    'Tab',
    'KeyQ',
    'KeyW',
    'KeyE',
    'KeyR',
    'KeyT',
    'KeyY',
    'KeyU',
    'KeyI',
    'KeyO',
    'KeyP',
    'BracketLeft',
    'BracketRight',
    'Backslash',
  ],
  [
    'CapsLock',
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyJ',
    'KeyK',
    'KeyL',
    'Semicolon',
    'Quote',
    'Enter',
  ],
  [
    'ShiftLeft',
    'KeyZ',
    'KeyX',
    'KeyC',
    'KeyV',
    'KeyB',
    'KeyN',
    'KeyM',
    'Comma',
    'Period',
    'Slash',
    'ShiftRight',
  ],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ControlRight'],
];

const MODIFIER_BY_CODE: Record<string, Modifier> = {
  ControlLeft: 'ctrl',
  ControlRight: 'ctrl',
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  AltLeft: 'alt',
  AltRight: 'alt',
  MetaLeft: 'cmd',
  MetaRight: 'cmd',
};

export function KeyboardPreview() {
  const { t } = useTranslation();
  const bindings = useAppStore((state) => state.config.bindings);

  const usedKeys = useMemo(() => new Set(bindings.map((binding) => binding.combo.key)), [bindings]);
  const usedModifiers = useMemo(
    () => new Set(bindings.flatMap((binding) => binding.combo.modifiers)),
    [bindings],
  );

  return (
    <section className="card flex min-h-[28rem] flex-col" aria-labelledby="preview-title">
      <div className="border-b border-ink-100 p-4">
        <h2 id="preview-title" className="text-sm font-bold uppercase tracking-wide text-ink-500">
          {t('editor.previewTitle')}
        </h2>
        <p className="mt-1 text-xs text-ink-500">{t('editor.previewBody')}</p>
      </div>

      <div className="flex-1 overflow-x-auto p-3">
        <div role="img" aria-label={t('keyboard.legend')} className="min-w-[30rem] space-y-1">
          {ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((code) => {
                const modifier = MODIFIER_BY_CODE[code];
                const used =
                  usedKeys.has(code) || (modifier !== undefined && usedModifiers.has(modifier));
                return (
                  <span
                    key={code}
                    aria-hidden="true"
                    className={[
                      'flex h-9 flex-1 items-center justify-center rounded-md border px-1 text-[10px] font-semibold uppercase transition',
                      used
                        ? 'border-accent-600 bg-accent-600 text-white shadow-sm'
                        : 'border-ink-100 bg-ink-50 text-ink-500',
                    ].join(' ')}
                  >
                    {keyLabel(code)}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-ink-100 p-3 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-3 w-3 rounded bg-accent-600" />
          {t('keyboard.used')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-3 w-3 rounded border border-ink-100 bg-ink-50" />
          {t('keyboard.unused')}
        </span>
      </div>
    </section>
  );
}
