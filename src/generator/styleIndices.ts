import type { Style } from '@/domain/types';

/**
 * Extracts the zero-based order of `w:lsdException` entries from `word/styles.xml`.
 * The T0 fixture proves this order is the index used by ApplyStyle (`acd` argValue):
 * Heading 1 -> 1, Heading 2 -> 2.
 */
export function extractLatentStyleIndices(stylesXml: string): Map<string, number> {
  const result = new Map<string, number>();
  const latent = /<w:latentStyles\b[^>]*>([\s\S]*?)<\/w:latentStyles>/.exec(stylesXml);
  const body = latent?.[1];
  if (!body) {
    return result;
  }

  const exceptions = [...body.matchAll(/<w:lsdException\b[^>]*\/>/g)];
  exceptions.forEach((match, index) => {
    const name = /w:name="([^"]*)"/.exec(match[0])?.[1];
    if (name !== undefined && !result.has(name)) {
      result.set(name, index);
    }
  });
  return result;
}

export function resolveStyleIndices(
  styles: Style[],
  latentIndices: Map<string, number>,
): Record<string, number> {
  const lowercase = new Map<string, number>();
  for (const [name, index] of latentIndices) {
    lowercase.set(name.toLowerCase(), index);
  }

  const resolved: Record<string, number> = {};
  for (const style of styles) {
    const index = latentIndices.get(style.wordName) ?? lowercase.get(style.wordName.toLowerCase());
    if (index !== undefined) {
      resolved[style.id] = index;
    }
  }
  return resolved;
}
