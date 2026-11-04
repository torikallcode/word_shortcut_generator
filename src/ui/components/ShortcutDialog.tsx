import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  browserBlockedCombos,
  commandCatalog,
  defaultShortcuts,
  keycodeTable,
  styleCatalog,
} from '@/data/catalog';
import { detectConflicts, normalizeCombo } from '@/domain/conflicts';
import type { Conflict } from '@/domain/conflicts';
import { comboFromKeyboardEvent, isComboValidForPlatform } from '@/domain/keycapture';
import { KEY_OPTIONS, formatCombo, keyLabel, modifierLabel } from '@/domain/keycodes';
import type { KeyCombo, Modifier, ShortcutBinding, Target } from '@/domain/types';
import { useAppStore } from '@/store/useAppStore';
import { targetInfo, targetKey } from '@/ui/lib/catalog';
import { localize } from '@/ui/lib/localize';
import { ComboChips } from './ComboChips';

const DRAFT_ID = '__draft__';
const MODIFIERS: Modifier[] = ['ctrl', 'alt', 'shift', 'cmd'];

interface ShortcutDialogProps {
  target: Target;
  binding: ShortcutBinding | null;
  onClose: () => void;
}

export function ShortcutDialog({ target, binding, onClose }: ShortcutDialogProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const platform = useAppStore((state) => state.config.platform);
  const bindings = useAppStore((state) => state.config.bindings);
  const addBinding = useAppStore((state) => state.addBinding);
  const updateBinding = useAppStore((state) => state.updateBinding);
  const overrideBinding = useAppStore((state) => state.overrideBinding);

  const dialogRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [combo, setCombo] = useState<KeyCombo | null>(binding?.combo ?? null);
  const [manualModifiers, setManualModifiers] = useState<Modifier[]>(
    binding?.combo.modifiers ?? [],
  );
  const [manualKey, setManualKey] = useState(binding?.combo.key ?? '');
  const [captureActive, setCaptureActive] = useState(false);
  const [touched, setTouched] = useState(false);

  const info = targetInfo(target, commandCatalog, styleCatalog);
  const targetName = info
    ? localize(info.name, language)
    : target.kind === 'command'
      ? target.commandId
      : target.styleId;

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    captureRef.current?.focus();
    setCaptureActive(true);
    return () => previous?.focus();
  }, []);

  useEffect(() => {
    function trapFocus(event: KeyboardEvent) {
      if (event.key !== 'Tab') {
        return;
      }
      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) {
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener('keydown', trapFocus);
    return () => window.removeEventListener('keydown', trapFocus);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (!captureActive) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab' || event.key === 'Escape') {
        return;
      }
      const captured = comboFromKeyboardEvent(event, platform);
      if (!captured) {
        setTouched(true);
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setCombo(captured);
      setManualModifiers(captured.modifiers);
      setManualKey(captured.key);
      setTouched(true);
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [captureActive, platform]);

  const conflicts = useMemo(() => {
    const others = bindings.filter(
      (item) => item.id !== binding?.id && targetKey(item.target) !== targetKey(target),
    );
    const draftBindings: ShortcutBinding[] = combo
      ? [...others, { id: DRAFT_ID, combo, target }]
      : others;
    return detectConflicts(draftBindings, {
      defaults: defaultShortcuts,
      browserBlocked: browserBlockedCombos,
      platform,
    });
  }, [bindings, binding, target, combo, platform]);

  const duplicate = conflicts.find(
    (conflict): conflict is Extract<Conflict, { kind: 'duplicate-binding' }> =>
      conflict.kind === 'duplicate-binding' && conflict.bindingIds.includes(DRAFT_ID),
  );
  const defaultConflict = conflicts.find(
    (conflict): conflict is Extract<Conflict, { kind: 'default-word' }> =>
      conflict.kind === 'default-word' && conflict.bindingId === DRAFT_ID,
  );
  const blockedConflict = conflicts.find(
    (conflict): conflict is Extract<Conflict, { kind: 'browser-blocked' }> =>
      conflict.kind === 'browser-blocked' && conflict.bindingId === DRAFT_ID,
  );

  const validForPlatform = combo !== null && isComboValidForPlatform(combo, platform);
  const keycodeMissing = combo !== null && keycodeTable.keys[combo.key] === undefined;
  const canApply = combo !== null && validForPlatform && !keycodeMissing && !duplicate;

  function resetCombo() {
    setCombo(null);
    setManualModifiers([]);
    setManualKey('');
  }

  function toggleModifier(modifier: Modifier) {
    const next = manualModifiers.includes(modifier)
      ? manualModifiers.filter((value) => value !== modifier)
      : [...manualModifiers, modifier];
    setManualModifiers(next);
    setTouched(true);
    if (manualKey !== '') {
      setCombo(normalizeCombo({ modifiers: next, key: manualKey }));
    } else {
      setCombo(null);
    }
  }

  function changeKey(key: string) {
    setManualKey(key);
    setTouched(true);
    if (key === '') {
      setCombo(null);
      return;
    }
    setCombo(normalizeCombo({ modifiers: manualModifiers, key }));
  }

  function commit(overwrite: boolean) {
    if (!combo) {
      return;
    }
    let id: string;
    if (binding) {
      updateBinding(binding.id, combo);
      id = binding.id;
    } else {
      id = addBinding(target, combo);
    }
    if (overwrite) {
      overrideBinding(id);
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcut-dialog-title"
        className="card w-full max-w-lg p-5"
      >
        <h2 id="shortcut-dialog-title" className="text-lg font-semibold">
          {binding ? t('shortcut.dialogTitleEdit') : t('shortcut.dialogTitleAdd')}
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          <span className="font-medium text-ink-700">{t('shortcut.targetLabel')}:</span>{' '}
          {targetName}
        </p>

        <div className="mt-4">
          <p className="label">{t('shortcut.captureTitle')}</p>
          <div
            ref={captureRef}
            tabIndex={0}
            role="group"
            aria-label={t('shortcut.captureTitle')}
            aria-describedby="capture-hint"
            onFocus={() => setCaptureActive(true)}
            onBlur={() => setCaptureActive(false)}
            onClick={() => captureRef.current?.focus()}
            className={[
              'flex min-h-16 items-center justify-center rounded-xl border-2 border-dashed px-4 py-4 text-center transition',
              captureActive
                ? 'border-accent-500 bg-accent-50'
                : 'border-ink-100 bg-ink-50 hover:border-accent-500',
            ].join(' ')}
          >
            {combo ? (
              <span className="flex flex-col items-center gap-2">
                <ComboChips combo={combo} platform={platform} />
                <span className="text-xs text-ink-500">
                  {formatCombo(combo, platform)} · {t('shortcut.captured')}
                </span>
              </span>
            ) : (
              <span className="text-sm font-medium text-ink-500">
                {t('shortcut.captureWaiting')}
              </span>
            )}
          </div>
          <p id="capture-hint" className="mt-2 text-xs text-ink-500">
            {t('shortcut.captureHint')}
          </p>
        </div>

        {duplicate ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <p className="font-semibold">{t('conflicts.duplicateTitle')}</p>
            <p className="mt-1">{t('conflicts.duplicateBody')}</p>
          </div>
        ) : null}

        {!duplicate && defaultConflict ? (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <p className="font-semibold">{t('conflicts.defaultTitle')}</p>
            <p className="mt-1">
              {t('conflicts.defaultBody', {
                combo: formatCombo(defaultConflict.defaultShortcut.combo, platform),
                name: localize(defaultConflict.defaultShortcut.name, language),
              })}
            </p>
          </div>
        ) : null}

        {blockedConflict ? (
          <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
            <p className="font-semibold">{t('conflicts.browserTitle')}</p>
            <p className="mt-1">
              {t('conflicts.browserBody', {
                combo: formatCombo(blockedConflict.blocked.combo, platform),
              })}
            </p>
          </div>
        ) : null}

        {combo && !validForPlatform ? (
          <p role="alert" className="mt-3 text-xs font-medium text-red-700">
            {t('shortcut.invalidCmdOnWindows')}
          </p>
        ) : null}

        {keycodeMissing ? (
          <p role="alert" className="mt-3 text-xs font-medium text-red-700">
            {t('shortcut.invalidKey')}
          </p>
        ) : null}

        {touched && !combo ? (
          <p role="alert" className="mt-3 text-xs font-medium text-red-700">
            {t('shortcut.invalidNoKey')}
          </p>
        ) : null}

        <details className="mt-4 rounded-lg border border-ink-100 p-3" open={combo === null}>
          <summary className="cursor-pointer text-xs font-semibold text-ink-700">
            {t('shortcut.orManual')}
          </summary>

          <fieldset className="mt-3">
            <legend className="label">{t('shortcut.manualModifiers')}</legend>
            <div className="flex flex-wrap gap-3">
              {MODIFIERS.map((modifier) => (
                <label
                  key={modifier}
                  className="inline-flex items-center gap-2 text-sm text-ink-700"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-ink-100 text-accent-600"
                    checked={manualModifiers.includes(modifier)}
                    onChange={() => toggleModifier(modifier)}
                  />
                  {modifierLabel(modifier, platform)}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-3">
            <label className="label" htmlFor="manual-key">
              {t('shortcut.manualKey')}
            </label>
            <select
              id="manual-key"
              className="input"
              value={manualKey}
              onChange={(event) => changeKey(event.target.value)}
            >
              <option value="">{t('shortcut.manualKeyPlaceholder')}</option>
              {KEY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {keyLabel(option.code)}
                </option>
              ))}
            </select>
          </div>
        </details>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>

          {duplicate ? (
            <button type="button" className="btn btn-primary" onClick={resetCombo}>
              {t('conflicts.change')}
            </button>
          ) : defaultConflict ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={resetCombo}>
                {t('conflicts.change')}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canApply}
                onClick={() => commit(true)}
              >
                {t('conflicts.overwrite')}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canApply}
              onClick={() => commit(false)}
            >
              {t('common.apply')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
