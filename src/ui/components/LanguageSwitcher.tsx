import { useTranslation } from 'react-i18next';
import i18n, { storeLanguage } from '@/i18n';
import type { Language } from '@/domain/types';
import { useAppStore } from '@/store/useAppStore';

const LANGUAGES: Language[] = ['id', 'en'];

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  function changeLanguage(next: Language) {
    setLanguage(next);
    storeLanguage(next);
    void i18n.changeLanguage(next);
  }

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="flex items-center rounded-lg border border-ink-100 bg-white p-0.5"
    >
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => changeLanguage(code)}
          aria-pressed={language === code}
          className={[
            'rounded-md px-2 py-1 text-xs font-semibold uppercase transition',
            language === code ? 'bg-accent-600 text-white' : 'text-ink-500 hover:bg-ink-100',
          ].join(' ')}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
