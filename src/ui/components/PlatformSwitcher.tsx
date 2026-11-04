import { useTranslation } from 'react-i18next';
import type { Platform } from '@/domain/types';
import { useAppStore } from '@/store/useAppStore';

const PLATFORMS: Platform[] = ['win', 'mac'];

export function PlatformSwitcher() {
  const { t } = useTranslation();
  const platform = useAppStore((state) => state.config.platform);
  const setPlatform = useAppStore((state) => state.setPlatform);

  return (
    <div
      role="group"
      aria-label={t('platform.label')}
      className="flex items-center rounded-lg border border-ink-100 bg-white p-0.5"
    >
      {PLATFORMS.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setPlatform(value)}
          aria-pressed={platform === value}
          className={[
            'rounded-md px-2 py-1 text-xs font-semibold transition',
            platform === value ? 'bg-ink-900 text-white' : 'text-ink-500 hover:bg-ink-100',
          ].join(' ')}
        >
          {t(`platform.${value}`)}
        </button>
      ))}
    </div>
  );
}
