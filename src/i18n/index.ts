import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Language } from '@/domain/types';
import en from './en.json';
import id from './id.json';

export const LANGUAGE_STORAGE_KEY = 'word-shortcut-builder.language';

export function detectLanguage(): Language {
  const stored = readStoredLanguage();
  if (stored) {
    return stored;
  }
  const browserLanguage = typeof navigator === 'undefined' ? '' : navigator.language.toLowerCase();
  return browserLanguage.startsWith('id') ? 'id' : 'en';
}

function readStoredLanguage(): Language | null {
  try {
    const value = globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY);
    return value === 'id' || value === 'en' ? value : null;
  } catch {
    return null;
  }
}

export function storeLanguage(language: Language): void {
  try {
    globalThis.localStorage?.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Language persistence is best-effort; private modes may reject storage.
  }
}

void i18n.use(initReactI18next).init({
  resources: {
    id: { translation: id },
    en: { translation: en },
  },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
