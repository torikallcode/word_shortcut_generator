export type BasePackage = Record<string, string | Uint8Array>;

/** OOXML parts that the PRD requires in every generated package (section 8). */
export const REQUIRED_ENTRIES = [
  '[Content_Types].xml',
  '_rels/.rels',
  'word/document.xml',
  'word/styles.xml',
  'word/settings.xml',
  'word/_rels/document.xml.rels',
] as const;

export const CUSTOMIZATIONS_PART = 'word/customizations.xml';

/** Content type for a macro-enabled Word template, as specified in PRD section 8/15. */
export const TEMPLATE_MIME_TYPE = 'application/vnd.ms-word.template.macroEnabledTemplate.12';

/** The main document content type that makes Word treat the package as a `.dotm`. */
export const TEMPLATE_MAIN_CONTENT_TYPE =
  'application/vnd.ms-word.template.macroEnabledTemplate.main+xml';

export function readTextPart(pkg: BasePackage, path: string): string | undefined {
  const value = pkg[path];
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'string' ? value : new TextDecoder().decode(value);
}

export function validateBasePackage(pkg: BasePackage): string[] {
  const problems: string[] = [];

  for (const entry of REQUIRED_ENTRIES) {
    if (!(entry in pkg)) {
      problems.push(`missing ${entry}`);
    }
  }

  const hasDocProps = Object.keys(pkg).some((path) => path.startsWith('docProps/'));
  if (!hasDocProps) {
    problems.push('missing docProps part');
  }

  const contentTypes = readTextPart(pkg, '[Content_Types].xml');
  if (contentTypes !== undefined && !contentTypes.includes(TEMPLATE_MAIN_CONTENT_TYPE)) {
    problems.push('main document is not a macro-enabled template content type');
  }

  const rels = readTextPart(pkg, 'word/_rels/document.xml.rels');
  if (rels !== undefined && !rels.includes('customizations.xml')) {
    problems.push(`document relationships do not reference ${CUSTOMIZATIONS_PART}`);
  }

  if (contentTypes !== undefined && !contentTypes.includes(CUSTOMIZATIONS_PART)) {
    problems.push(`[Content_Types].xml has no override for ${CUSTOMIZATIONS_PART}`);
  }

  return problems;
}
