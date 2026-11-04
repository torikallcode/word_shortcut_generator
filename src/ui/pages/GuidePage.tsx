import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Platform } from '@/domain/types';
import { useAppStore } from '@/store/useAppStore';
import { copyText } from '@/ui/lib/copy';

const STEPS = ['backup', 'close', 'copy', 'paste', 'restart'] as const;
const TROUBLE_ITEMS = ['blocked', 'wordOpen', 'otherCopy', 'onedrive', 'macPath'] as const;

export function GuidePage() {
  const { t } = useTranslation();
  const platform = useAppStore((state) => state.config.platform);
  const [tab, setTab] = useState<Platform>(platform);
  const [copied, setCopied] = useState(false);

  const folderPath = tab === 'win' ? t('guide.folderWindows') : t('guide.folderMac');

  async function copyFolder() {
    const ok = await copyText(folderPath);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('guide.title')}</h1>
        <p className="mt-1 text-sm text-ink-500">{t('guide.subtitle')}</p>
      </div>

      <div className="flex gap-1" role="group" aria-label={t('guide.title')}>
        {(['win', 'mac'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            aria-pressed={tab === value}
            className={[
              'rounded-md px-3 py-1.5 text-sm font-semibold transition',
              tab === value ? 'bg-ink-900 text-white' : 'text-ink-500 hover:bg-ink-100',
            ].join(' ')}
          >
            {t(`guide.tabs.${value}`)}
          </button>
        ))}
      </div>

      <section className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          {t('guide.folderTitle')}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 break-all rounded-lg border border-ink-100 bg-ink-50 px-3 py-2 font-mono text-sm">
            {folderPath}
          </code>
          <button type="button" className="btn btn-secondary" onClick={() => void copyFolder()}>
            {copied ? t('common.copied') : t('guide.copyFolder')}
          </button>
        </div>
        {import.meta.env.DEV ? (
          <p className="mt-2 text-xs text-amber-700">{t('guide.folderProvisional')}</p>
        ) : null}
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          {t('guide.stepsTitle')}
        </h2>
        <ol className="mt-4 space-y-4">
          {STEPS.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold">{t(`guide.steps.${step}.title`)}</h3>
                <p className="mt-1 text-sm text-ink-500">{t(`guide.steps.${step}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          {t('guide.unblockTitle')}
        </h2>
        <p className="mt-2 text-sm text-ink-500">{t('guide.unblockBody')}</p>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          {t('guide.troubleTitle')}
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-500">
          {TROUBLE_ITEMS.map((item) => (
            <li key={item}>{t(`guide.troubleItems.${item}`)}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-semibold">{t('guide.warningTitle')}</p>
        <p className="mt-1 text-xs leading-relaxed">{t('guide.warningBody')}</p>
      </section>
    </div>
  );
}
