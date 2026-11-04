import { useMemo } from 'react';
import { detectConflicts, unresolvedConflicts } from '@/domain/conflicts';
import { browserBlockedCombos, defaultShortcuts } from '@/data/catalog';
import { useAppStore } from '@/store/useAppStore';

export function useConflicts() {
  const config = useAppStore((state) => state.config);
  const overrides = useAppStore((state) => state.overrides);

  const conflicts = useMemo(
    () =>
      detectConflicts(config.bindings, {
        defaults: defaultShortcuts,
        browserBlocked: browserBlockedCombos,
        platform: config.platform,
      }),
    [config],
  );

  const unresolved = useMemo(
    () => unresolvedConflicts(conflicts, overrides),
    [conflicts, overrides],
  );

  return { conflicts, unresolved };
}
