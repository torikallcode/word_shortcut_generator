import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  browserBlockedCombos,
  catalogReady,
  commandCatalog,
  defaultShortcuts,
  keycodeTable,
  keycodesReady,
  styleCatalog,
} from '@/data/catalog';
import { basePackageConfigured } from '@/data/basePackageStatus';
import { findMissingTargets, serializeConfig } from '@/domain/config';
import { isComboValidForPlatform } from '@/domain/keycapture';
import { downloadText } from '@/generator/download';
import { useAppStore } from '@/store/useAppStore';
import { ComboChips } from '@/ui/components/ComboChips';
import { useConflicts } from '@/ui/hooks/useConflicts';
import { targetInfo } from '@/ui/lib/catalog';
import { errorMessageKey } from '@/ui/lib/errorMessage';
import { localize } from '@/ui/lib/localize';

export function SummaryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = useAppStore((state) => state.language);
  const platform = useAppStore((state) => state.config.platform);
  const config = useAppStore((state) => state.config);
  const overrides = useAppStore((state) => state.overrides);
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const { unresolved } = useConflicts();

  const fixturesMissing = !catalogReady || !keycodesReady || !basePackageConfigured;
  const macPending = config.platform === 'mac';
  const missingTargets = findMissingTargets(config, {
    commands: commandCatalog,
    styles: styleCatalog,
  });
  const invalidCombos = config.bindings.filter(
    (binding) => !isComboValidForPlatform(binding.combo, config.platform),
  );
  const canDownload =
    config.bindings.length > 0 &&
    unresolved.length === 0 &&
    invalidCombos.length === 0 &&
    !fixturesMissing &&
    !macPending &&
    !busy;

  async function download() {
    setBusy(true);
    setErrorKey(null);
    try {
      // Keep JSZip and the base-package XML out of the initial bundle.
      const [{ buildNormalDotm, downloadBlob, renderCustomizations }, { loadBasePackage }] =
        await Promise.all([import('@/generator'), import('@/data/basePackage')]);
      const basePackage = await loadBasePackage();
      const result = await buildNormalDotm(config, {
        basePackage,
        renderCustomizations,
        keycodes: keycodeTable,
        commands: commandCatalog,
        styles: styleCatalog,
        defaults: defaultShortcuts,
        browserBlocked: browserBlockedCombos,
        overrides,
      });
      downloadBlob(result.blob, result.fileName);
    } catch (error) {
      setErrorKey(errorMessageKey(error));
    } finally {
      setBusy(false);
    }
  }

  function saveConfig() {
    downloadText(serializeConfig(config), 'word-shortcuts.json', 'application/json');
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('summary.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('summary.subtitle')}</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/editor')}>
          {t('summary.backToEditor')}
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            {t('summary.count')}
          </p>
          <p className="mt-1 text-2xl font-bold">{config.bindings.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            {t('summary.platform')}
          </p>
          <p className="mt-1 text-2xl font-bold">{t(`platform.${platform}`)}</p>
        </div>
      </section>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-semibold">{t('summary.warningTitle')}</p>
        <p className="mt-1 text-xs leading-relaxed">{t('summary.warningBody')}</p>
      </div>

      {unresolved.length > 0 ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p className="font-semibold">{t('summary.unresolvedTitle')}</p>
          <p className="mt-1 text-xs">{t('summary.unresolvedBody')}</p>
        </div>
      ) : null}

      {macPending ? (
        <div
          role="status"
          className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"
        >
          <p className="font-semibold">{t('summary.macPendingTitle')}</p>
          <p className="mt-1 text-xs leading-relaxed">{t('summary.macPendingBody')}</p>
        </div>
      ) : null}

      {fixturesMissing ? (
        <div
          role="status"
          className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"
        >
          <p className="font-semibold">{t('summary.fixturesPendingTitle')}</p>
          <p className="mt-1 text-xs leading-relaxed">{t('summary.fixturesPendingBody')}</p>
        </div>
      ) : null}

      {invalidCombos.length > 0 ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p className="font-semibold">{t('conflicts.invalidPlatformTitle')}</p>
          <p className="mt-1 text-xs">{t('conflicts.invalidPlatformBody')}</p>
        </div>
      ) : null}

      {missingTargets.length > 0 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          {t('summary.missingTargets', {
            list: missingTargets
              .map((missing) =>
                missing.target.kind === 'command'
                  ? missing.target.commandId
                  : missing.target.styleId,
              )
              .join(', '),
          })}
        </p>
      ) : null}

      {errorKey ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {t(errorKey)}
        </p>
      ) : null}

      {config.bindings.length === 0 ? (
        <section className="card p-8 text-center">
          <h2 className="text-lg font-semibold">{t('summary.emptyTitle')}</h2>
          <p className="mt-2 text-sm text-ink-500">{t('summary.emptyBody')}</p>
          <button
            type="button"
            className="btn btn-primary mt-5"
            onClick={() => navigate('/editor')}
          >
            {t('summary.backToEditor')}
          </button>
        </section>
      ) : (
        <section className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{t('summary.title')}</caption>
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t('summary.target')}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t('summary.type')}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t('summary.shortcut')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {config.bindings.map((binding) => {
                  const info = targetInfo(binding.target, commandCatalog, styleCatalog);
                  const name = info
                    ? localize(info.name, language)
                    : binding.target.kind === 'command'
                      ? binding.target.commandId
                      : binding.target.styleId;
                  const kind = binding.target.kind;
                  return (
                    <tr key={binding.id}>
                      <td className="px-4 py-3 font-medium">{name}</td>
                      <td className="px-4 py-3 text-ink-500">
                        {kind === 'command' ? t('summary.typeCommand') : t('summary.typeStyle')}
                      </td>
                      <td className="px-4 py-3">
                        <ComboChips combo={binding.combo} platform={platform} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={saveConfig}>
          {t('summary.saveJson')}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canDownload}
          onClick={() => void download()}
        >
          {busy ? t('summary.generating') : t('summary.download')}
        </button>
      </div>
    </div>
  );
}
