import { useTranslation } from 'react-i18next';
import { commandCatalog, styleCatalog } from '@/data/catalog';
import type { Conflict } from '@/domain/conflicts';
import { conflictsForBindings } from '@/domain/conflicts';
import { isComboValidForPlatform } from '@/domain/keycapture';
import { formatCombo } from '@/domain/keycodes';
import type { ShortcutBinding } from '@/domain/types';
import { useAppStore } from '@/store/useAppStore';
import { targetInfo } from '@/ui/lib/catalog';
import { localize } from '@/ui/lib/localize';
import { ComboChips } from './ComboChips';

interface BindingsPanelProps {
  conflicts: Conflict[];
  onEdit: (binding: ShortcutBinding) => void;
}

export function BindingsPanel({ conflicts, onEdit }: BindingsPanelProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const platform = useAppStore((state) => state.config.platform);
  const bindings = useAppStore((state) => state.config.bindings);
  const overrides = useAppStore((state) => state.overrides);
  const removeBinding = useAppStore((state) => state.removeBinding);

  return (
    <section className="card flex min-h-[28rem] flex-col" aria-labelledby="bindings-title">
      <div className="border-b border-ink-100 p-4">
        <h2 id="bindings-title" className="text-sm font-bold uppercase tracking-wide text-ink-500">
          {t('editor.bindingsTitle')}
        </h2>
        <p className="mt-1 text-xs text-ink-500">
          {t('editor.bindingsCount', { count: bindings.length })}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {bindings.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm font-semibold">{t('editor.bindingsEmptyTitle')}</p>
            <p className="mt-2 text-xs text-ink-500">{t('editor.bindingsEmptyBody')}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {bindings.map((binding) => {
              const info = targetInfo(binding.target, commandCatalog, styleCatalog);
              const name = info
                ? localize(info.name, language)
                : binding.target.kind === 'command'
                  ? binding.target.commandId
                  : binding.target.styleId;
              const bindingConflicts = conflictsForBindings(conflicts, [binding.id]);

              return (
                <li key={binding.id} className="rounded-lg border border-ink-100 p-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{name}</p>
                      <p className="mt-1">
                        <ComboChips combo={binding.combo} platform={platform} />
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        aria-label={t('editor.bindingEdit', { name })}
                        onClick={() => onEdit(binding)}
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        aria-label={t('editor.bindingRemove', { name })}
                        onClick={() => removeBinding(binding.id)}
                      >
                        {t('common.remove')}
                      </button>
                    </div>
                  </div>

                  {!isComboValidForPlatform(binding.combo, platform) ? (
                    <p className="mt-2 text-xs text-red-600">
                      {t('conflicts.invalidPlatformBody')}
                    </p>
                  ) : null}

                  <BindingStatus
                    conflicts={bindingConflicts}
                    overridden={overrides[binding.id] === true}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

interface BindingStatusProps {
  conflicts: Conflict[];
  overridden: boolean;
}

function BindingStatus({ conflicts, overridden }: BindingStatusProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const platform = useAppStore((state) => state.config.platform);

  if (conflicts.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 space-y-1 text-xs">
      {conflicts.map((conflict, index) => {
        if (conflict.kind === 'duplicate-binding') {
          return (
            <li key={`${conflict.kind}-${index}`} className="text-red-600">
              {t('conflicts.duplicateTitle')}
            </li>
          );
        }
        if (conflict.kind === 'default-word') {
          return (
            <li
              key={`${conflict.kind}-${index}`}
              className={overridden ? 'text-emerald-600' : 'text-amber-700'}
            >
              {overridden
                ? t('conflicts.overwritten')
                : t('conflicts.defaultBody', {
                    combo: formatCombo(conflict.defaultShortcut.combo, platform),
                    name: localize(conflict.defaultShortcut.name, language),
                  })}
            </li>
          );
        }
        return (
          <li key={`${conflict.kind}-${index}`} className="text-sky-700">
            {t('conflicts.browserTitle')}
          </li>
        );
      })}
    </ul>
  );
}
