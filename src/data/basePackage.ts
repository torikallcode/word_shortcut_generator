import type { BasePackage } from '@/generator/packageStructure';
import contentTypes from './base-package/[Content_Types].xml?raw';
import rootRels from './base-package/_rels/.rels?raw';
import appProps from './base-package/docProps/app.xml?raw';
import coreProps from './base-package/docProps/core.xml?raw';
import documentRels from './base-package/word/_rels/document.xml.rels?raw';
import documentXml from './base-package/word/document.xml?raw';
import fontTable from './base-package/word/fontTable.xml?raw';
import glossaryRels from './base-package/word/glossary/_rels/document.xml.rels?raw';
import glossaryDocument from './base-package/word/glossary/document.xml?raw';
import glossaryFontTable from './base-package/word/glossary/fontTable.xml?raw';
import glossarySettings from './base-package/word/glossary/settings.xml?raw';
import glossaryStyles from './base-package/word/glossary/styles.xml?raw';
import glossaryWebSettings from './base-package/word/glossary/webSettings.xml?raw';
import settingsXml from './base-package/word/settings.xml?raw';
import stylesXml from './base-package/word/styles.xml?raw';
import theme from './base-package/word/theme/theme1.xml?raw';
import webSettings from './base-package/word/webSettings.xml?raw';

/**
 * Static OOXML parts copied from the T0 Windows Word 2021 fixture. They are imported
 * explicitly (not with a glob) because `_rels/.rels` is a dotfile that globs skip.
 *
 * `word/customizations.xml` is intentionally absent: the generator writes it.
 */
const PARTS: BasePackage = {
  '[Content_Types].xml': contentTypes,
  '_rels/.rels': rootRels,
  'docProps/app.xml': appProps,
  'docProps/core.xml': coreProps,
  'word/_rels/document.xml.rels': documentRels,
  'word/document.xml': documentXml,
  'word/fontTable.xml': fontTable,
  'word/glossary/_rels/document.xml.rels': glossaryRels,
  'word/glossary/document.xml': glossaryDocument,
  'word/glossary/fontTable.xml': glossaryFontTable,
  'word/glossary/settings.xml': glossarySettings,
  'word/glossary/styles.xml': glossaryStyles,
  'word/glossary/webSettings.xml': glossaryWebSettings,
  'word/settings.xml': settingsXml,
  'word/styles.xml': stylesXml,
  'word/theme/theme1.xml': theme,
  'word/webSettings.xml': webSettings,
};

export const basePackageConfigured = true;

export async function loadBasePackage(): Promise<BasePackage> {
  return { ...PARTS };
}
