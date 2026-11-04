import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { catalogReady, keycodesReady } from '@/data/catalog';
import { serializeConfig } from '@/domain/config';
import type { ShortcutBinding, Target } from '@/domain/types';
import { downloadText } from '@/generator/download';
import { useAppStore } from '@/store/useAppStore';
import { useConflicts } from '@/ui/hooks/useConflicts';
import { findBindingForTarget } from '@/ui/lib/catalog';
import { BindingsPanel } from '@/ui/components/BindingsPanel';
import { CatalogPanel } from '@/ui/components/CatalogPanel';
import { KeyboardPreview } from '@/ui/components/KeyboardPreview';
import { ShortcutDialog } from '@/ui/components/ShortcutDialog';

interface DialogState {
  target: Target;
  binding: ShortcutBinding | null;
}

export function EditorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const config = useAppStore((state) => state.config);
  const clearBindings = useAppStore((state) => state.clearBindings);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const { conflicts, unresolved } = useConflicts();

  function openTarget(target: Target) {
    setDialog({ target, binding: findBindingForTarget(config.bindings, target) ?? null });
  }

  function openBinding(binding: ShortcutBinding) {
    setDialog({ target: binding.target, binding });
  }

  function saveConfig() {
    downloadText(serializeConfig(config), 'word-shortcuts.json', 'application/json');
  }

  function removeAll() {
    if (window.confirm(t('editor.clearAllConfirm'))) {
      clearBindings();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('editor.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('editor.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={saveConfig}>
            {t('editor.saveConfig')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/summary')}>
            {t('editor.review')}
          </button>
        </div>
      </div>

      {!catalogReady || !keycodesReady ? (
        <div
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          <p className="font-semibold">{t('editor.catalogEmptyTitle')}</p>
          <p className="mt-1 text-xs">{t('editor.catalogEmptyBody')}</p>
        </div>
      ) : null}

      {unresolved.length > 0 ? (
        <div
          role="status"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p className="font-semibold">{t('conflicts.summaryTitle')}</p>
          <p className="mt-1 text-xs">{t('conflicts.summaryBody')}</p>
        </div>
      ) : null}

      <p className="text-xs text-ink-500">{t('editor.platformHint')}</p>

      <div className="grid gap-4 xl:grid-cols-3">
        <CatalogPanel onSelect={openTarget} />
        <BindingsPanel conflicts={conflicts} onEdit={openBinding} />
        <KeyboardPreview />
      </div>

      <div className="flex justify-end">
        <button type="button" className="btn btn-danger" onClick={removeAll}>
          {t('editor.clearAll')}
        </button>
      </div>

      {dialog ? (
        <ShortcutDialog
          target={dialog.target}
          binding={dialog.binding}
          onClose={() => setDialog(null)}
        />
      ) : null}
    </div>
  );
}
