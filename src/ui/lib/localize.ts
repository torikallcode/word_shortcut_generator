import type { Language, LocalizedText } from '@/domain/types';

export function localize(text: LocalizedText, language: Language): string {
  return text[language];
}
