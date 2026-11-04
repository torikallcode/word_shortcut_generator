import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LanguageSwitcher } from '@/ui/components/LanguageSwitcher';
import { PlatformSwitcher } from '@/ui/components/PlatformSwitcher';

const NAV_ITEMS = [
  { to: '/', key: 'app.nav.home', end: true },
  { to: '/editor', key: 'app.nav.editor', end: false },
  { to: '/summary', key: 'app.nav.summary', end: false },
  { to: '/guide', key: 'app.nav.guide', end: false },
] as const;

export function AppLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 rounded-lg text-sm font-bold">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 font-mono text-base text-white"
            >
              ⌨
            </span>
            <span className="hidden sm:inline">{t('app.title')}</span>
          </Link>

          <nav aria-label={t('app.title')} className="order-3 w-full sm:order-none sm:w-auto">
            <ul className="flex flex-wrap items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        'inline-flex rounded-lg px-3 py-1.5 text-sm font-medium transition',
                        isActive
                          ? 'bg-accent-50 text-accent-700'
                          : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900',
                      ].join(' ')
                    }
                  >
                    {t(item.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <PlatformSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t('footer.privacy')}</p>
          <p>{t('footer.noServer')}</p>
        </div>
      </footer>
    </div>
  );
}
