import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { commandCatalog, presets, styleCatalog } from '@/data/catalog';
import { parseConfig } from '@/domain/config';
import { useAppStore } from '@/store/useAppStore';
import { errorMessageKey } from '@/ui/lib/errorMessage';
import { localize } from '@/ui/lib/localize';

interface Notice {
  tone: 'error' | 'info';
  message: string;
}

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = useAppStore((state) => state.language);
  const reset = useAppStore((state) => state.reset);
  const addBinding = useAppStore((state) => state.addBinding);
  const replaceConfig = useAppStore((state) => state.replaceConfig);
  const fileInput = useRef<HTMLInputElement>(null);
  const [presetId, setPresetId] = useState(presets[0]?.id ?? '');
  const [notice, setNotice] = useState<Notice | null>(null);

  const selectedPreset = presets.find((preset) => preset.id === presetId);

  function startEmpty() {
    reset();
    navigate('/editor');
  }

  function applyPreset() {
    if (!selectedPreset) {
      return;
    }
    reset();
    for (const binding of selectedPreset.bindings) {
      addBinding(binding.target, binding.combo);
    }
    navigate('/editor');
  }

  async function loadConfigFile(file: File) {
    try {
      const text = await file.text();
      const { config, missingTargets } = parseConfig(text, {
        commands: commandCatalog,
        styles: styleCatalog,
      });
      replaceConfig(config);
      if (missingTargets.length > 0) {
        setNotice({
          tone: 'info',
          message: t('home.loadMissing', { count: missingTargets.length }),
        });
      } else {
        setNotice(null);
      }
      navigate('/editor');
    } catch (error) {
      setNotice({ tone: 'error', message: t(errorMessageKey(error)) });
    }
  }

  return (
    <div className="space-y-8">
      <section className="card overflow-hidden">
        <div className="bg-gradient-to-br from-accent-50 via-white to-ink-50 px-6 py-10 sm:px-10 sm:py-14">
          <span className="badge border-accent-100 bg-accent-50 text-accent-700">
            {t('home.badge')}
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            {t('home.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink-500 sm:text-lg">{t('home.subtitle')}</p>
        </div>
      </section>

      {notice ? (
        <div
          role={notice.tone === 'error' ? 'alert' : 'status'}
          className={[
            'rounded-lg border px-4 py-3 text-sm',
            notice.tone === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-amber-200 bg-amber-50 text-amber-800',
          ].join(' ')}
        >
          {notice.message}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="card flex flex-col p-5">
          <h2 className="text-lg font-semibold">{t('home.startEmptyTitle')}</h2>
          <p className="mt-2 flex-1 text-sm text-ink-500">{t('home.startEmptyBody')}</p>
          <button type="button" className="btn btn-primary mt-5" onClick={startEmpty}>
            {t('home.startEmptyAction')}
          </button>
        </article>

        <article className="card flex flex-col p-5">
          <h2 className="text-lg font-semibold">{t('home.presetTitle')}</h2>
          <p className="mt-2 text-sm text-ink-500">{t('home.presetBody')}</p>
          <label className="label mt-4" htmlFor="preset">
            {t('home.presetTitle')}
          </label>
          <select
            id="preset"
            className="input"
            value={presetId}
            onChange={(event) => setPresetId(event.target.value)}
          >
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {localize(preset.name, language)}
              </option>
            ))}
          </select>
          {selectedPreset ? (
            <p className="mt-2 text-xs text-ink-500">
              {localize(selectedPreset.description, language)}
            </p>
          ) : null}
          {selectedPreset && selectedPreset.bindings.length === 0 ? (
            <p className="mt-2 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
              {t('home.presetEmpty')}
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-secondary mt-4"
            onClick={applyPreset}
            disabled={!selectedPreset}
          >
            {t('home.presetAction')}
          </button>
        </article>

        <article className="card flex flex-col p-5">
          <h2 className="text-lg font-semibold">{t('home.loadTitle')}</h2>
          <p className="mt-2 flex-1 text-sm text-ink-500">{t('home.loadBody')}</p>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label={t('home.loadAction')}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) {
                void loadConfigFile(file);
              }
            }}
          />
          <button
            type="button"
            className="btn btn-secondary mt-5"
            onClick={() => fileInput.current?.click()}
          >
            {t('home.loadAction')}
          </button>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="card p-5">
          <h2 className="text-base font-semibold">{t('home.privacyTitle')}</h2>
          <p className="mt-2 text-sm text-ink-500">{t('home.privacyBody')}</p>
        </article>
        <article className="card p-5">
          <h2 className="text-base font-semibold">{t('home.scopeTitle')}</h2>
          <p className="mt-2 text-sm text-ink-500">{t('home.scopeBody')}</p>
        </article>
      </section>
    </div>
  );
}
