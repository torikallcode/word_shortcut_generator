import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { commandCatalog, styleCatalog } from '@/data/catalog';
import type { Target } from '@/domain/types';
import { useAppStore } from '@/store/useAppStore';
import { findBindingForTarget } from '@/ui/lib/catalog';
import { localize } from '@/ui/lib/localize';
import { ComboChips } from './ComboChips';

interface CatalogPanelProps {
  onSelect: (target: Target) => void;
}

type CatalogTab = 'commands' | 'styles';

function matchesSearch(text: string, query: string): boolean {
  return text.toLowerCase().includes(query);
}

export function CatalogPanel({ onSelect }: CatalogPanelProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const platform = useAppStore((state) => state.config.platform);
  const bindings = useAppStore((state) => state.config.bindings);
  const [tab, setTab] = useState<CatalogTab>('commands');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const commands = useMemo(
    () => commandCatalog.filter((command) => command.platforms.includes(platform)),
    [platform],
  );
  const styles = useMemo(
    () => styleCatalog.filter((style) => style.platforms.includes(platform)),
    [platform],
  );

  const categories = useMemo(
    () => Array.from(new Set(commands.map((command) => command.category))).sort(),
    [commands],
  );

  const query = search.trim().toLowerCase();

  const filteredCommands = useMemo(
    () =>
      commands.filter((command) => {
        if (category !== 'all' && command.category !== category) {
          return false;
        }
        if (query === '') {
          return true;
        }
        return (
          matchesSearch(command.name.id, query) ||
          matchesSearch(command.name.en, query) ||
          matchesSearch(command.description.id, query) ||
          matchesSearch(command.description.en, query)
        );
      }),
    [commands, category, query],
  );

  const filteredStyles = useMemo(
    () =>
      styles.filter((style) => {
        if (query === '') {
          return true;
        }
        return matchesSearch(style.name.id, query) || matchesSearch(style.name.en, query);
      }),
    [styles, query],
  );

  const emptyCatalog = commandCatalog.length === 0 && styleCatalog.length === 0;

  function assignedCombo(target: Target) {
    return findBindingForTarget(bindings, target);
  }

  function categoryLabel(value: string): string {
    return t(`categories.${value}`, { defaultValue: value.replace(/[_-]/g, ' ') });
  }

  return (
    <section className="card flex min-h-[28rem] flex-col" aria-labelledby="catalog-title">
      <div className="border-b border-ink-100 p-4">
        <h2 id="catalog-title" className="text-sm font-bold uppercase tracking-wide text-ink-500">
          {t('editor.catalogTitle')}
        </h2>

        <div className="mt-3 flex gap-1" role="group" aria-label={t('editor.catalogTitle')}>
          {(['commands', 'styles'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-pressed={tab === value}
              className={[
                'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                tab === value ? 'bg-ink-900 text-white' : 'text-ink-500 hover:bg-ink-100',
              ].join(' ')}
            >
              {t(`editor.tabs.${value}`)}
            </button>
          ))}
        </div>

        <label className="label mt-4" htmlFor="catalog-search">
          {t('editor.catalogSearch')}
        </label>
        <input
          id="catalog-search"
          type="search"
          className="input"
          value={search}
          placeholder={t('editor.catalogSearch')}
          onChange={(event) => setSearch(event.target.value)}
        />

        {tab === 'commands' ? (
          <div className="mt-3">
            <label className="label" htmlFor="catalog-category">
              {t('editor.catalogCategory')}
            </label>
            <select
              id="catalog-category"
              className="input"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">{t('editor.catalogAll')}</option>
              {categories.map((value) => (
                <option key={value} value={value}>
                  {categoryLabel(value)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {emptyCatalog ? (
          <div className="p-4 text-center">
            <p className="text-sm font-semibold">{t('editor.catalogEmptyTitle')}</p>
            <p className="mt-2 text-xs text-ink-500">{t('editor.catalogEmptyBody')}</p>
          </div>
        ) : tab === 'commands' ? (
          filteredCommands.length === 0 ? (
            <p className="p-4 text-center text-xs text-ink-500">{t('common.notAvailable')}</p>
          ) : (
            <ul className="space-y-1">
              {filteredCommands.map((command) => (
                <li key={command.id}>
                  <CatalogItem
                    name={localize(command.name, language)}
                    description={localize(command.description, language)}
                    category={categoryLabel(command.category)}
                    binding={assignedCombo({ kind: 'command', commandId: command.id })}
                    onSelect={() => onSelect({ kind: 'command', commandId: command.id })}
                  />
                </li>
              ))}
            </ul>
          )
        ) : filteredStyles.length === 0 ? (
          <p className="p-4 text-center text-xs text-ink-500">{t('common.notAvailable')}</p>
        ) : (
          <ul className="space-y-1">
            {filteredStyles.map((style) => (
              <li key={style.id}>
                <CatalogItem
                  name={localize(style.name, language)}
                  description=""
                  category={t('editor.tabs.styles')}
                  binding={assignedCombo({ kind: 'style', styleId: style.id })}
                  onSelect={() => onSelect({ kind: 'style', styleId: style.id })}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

interface CatalogItemProps {
  name: string;
  description: string;
  category: string;
  binding: ReturnType<typeof findBindingForTarget>;
  onSelect: () => void;
}

function CatalogItem({ name, description, category, binding, onSelect }: CatalogItemProps) {
  const { t } = useTranslation();
  const platform = useAppStore((state) => state.config.platform);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full items-start gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition hover:border-ink-100 hover:bg-ink-50"
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{name}</span>
          <span className="badge">{category}</span>
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">{description}</span>
        ) : null}
      </span>
      <span className="shrink-0 pt-0.5">
        {binding ? (
          <ComboChips combo={binding.combo} platform={platform} />
        ) : (
          <span className="text-xs font-semibold text-accent-600">
            {t('editor.bindingUnassigned')}
          </span>
        )}
      </span>
    </button>
  );
}
