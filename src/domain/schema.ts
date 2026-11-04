import { z } from 'zod';

export const platformSchema = z.enum(['win', 'mac']);
export const modifierSchema = z.enum(['ctrl', 'alt', 'shift', 'cmd']);
export const localizedTextSchema = z.object({
  id: z.string().min(1),
  en: z.string().min(1),
});

export const keyComboSchema = z
  .object({
    modifiers: z.array(modifierSchema).max(4),
    key: z.string().min(1),
  })
  .superRefine((combo, ctx) => {
    if (new Set(combo.modifiers).size !== combo.modifiers.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate modifiers are not allowed',
        path: ['modifiers'],
      });
    }
  });

export const targetSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('command'), commandId: z.string().min(1) }),
  z.object({ kind: z.literal('style'), styleId: z.string().min(1) }),
]);

export const shortcutBindingSchema = z.object({
  id: z.string().min(1),
  combo: keyComboSchema,
  target: targetSchema,
});

export const configSchema = z.object({
  version: z.literal(1),
  platform: platformSchema,
  bindings: z.array(shortcutBindingSchema),
});

export const commandSchema = z.object({
  id: z.string().min(1),
  wordName: z.string().min(1),
  category: z.string().min(1),
  name: localizedTextSchema,
  description: localizedTextSchema,
  platforms: z.array(platformSchema).min(1),
});

export const styleSchema = z.object({
  id: z.string().min(1),
  wordName: z.string().min(1),
  name: localizedTextSchema,
  platforms: z.array(platformSchema).min(1),
});

export const defaultShortcutSchema = z.object({
  combo: keyComboSchema,
  target: z.object({
    kind: z.enum(['command', 'style']),
    wordName: z.string().min(1),
  }),
  name: localizedTextSchema,
  platforms: z.array(platformSchema).min(1),
});

export const presetSchema = z.object({
  id: z.string().min(1),
  name: localizedTextSchema,
  description: localizedTextSchema,
  bindings: z.array(
    z.object({
      combo: keyComboSchema,
      target: targetSchema,
    }),
  ),
});

export const browserBlockedComboSchema = z.object({
  combo: keyComboSchema,
  platforms: z.array(platformSchema).min(1),
});

export const keycodeTableSchema = z.object({
  status: z.enum(['pending-t0', 'ready']),
  modifiers: z.record(modifierSchema, z.number().int()),
  keys: z.record(z.string(), z.number().int()),
});

export const commandCatalogSchema = z.array(commandSchema);
export const styleCatalogSchema = z.array(styleSchema);
export const defaultShortcutListSchema = z.array(defaultShortcutSchema);
export const presetListSchema = z.array(presetSchema);
export const browserBlockedListSchema = z.array(browserBlockedComboSchema);
