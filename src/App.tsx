import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import i18n from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import { AppLayout } from '@/ui/AppLayout';
import { EditorPage } from '@/ui/pages/EditorPage';
import { GuidePage } from '@/ui/pages/GuidePage';
import { HomePage } from '@/ui/pages/HomePage';
import { SummaryPage } from '@/ui/pages/SummaryPage';

function LanguageSync() {
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
    document.documentElement.lang = language;
  }, [language]);

  return null;
}

export function App() {
  return (
    <HashRouter>
      <LanguageSync />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
