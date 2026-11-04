import JSZip from 'jszip';
import { findMissingTargets } from '@/domain/config';
import { detectConflicts, unresolvedConflicts } from '@/domain/conflicts';
import {
  ConfigValidationError,
  FixturesRequiredError,
  InvalidCombosError,
  MissingTargetsError,
  PackageStructureError,
  UnresolvedConflictsError,
} from '@/domain/errors';
import { isComboValidForPlatform } from '@/domain/keycapture';
import { configSchema } from '@/domain/schema';
import type {
  BrowserBlockedCombo,
  Command,
  Config,
  DefaultShortcut,
  KeycodeTable,
  Style,
} from '@/domain/types';
import type { CustomizationsRenderer } from './customizations';
import {
  CUSTOMIZATIONS_PART,
  TEMPLATE_MIME_TYPE,
  type BasePackage,
  readTextPart,
  validateBasePackage,
} from './packageStructure';
import { extractLatentStyleIndices, resolveStyleIndices } from './styleIndices';

export interface BuildNormalDotmOptions {
  basePackage: BasePackage;
  renderCustomizations: CustomizationsRenderer;
  keycodes: KeycodeTable;
  commands: Command[];
  styles: Style[];
  defaults: DefaultShortcut[];
  browserBlocked: BrowserBlockedCombo[];
  overrides?: Readonly<Record<string, boolean>>;
}

export interface BuildResult {
  blob: Blob;
  fileName: 'Normal.dotm';
}

/**
 * Builds a `.dotm` package from validated config plus fixture-derived parts.
 * Order follows PRD section 15.
 */
export async function buildNormalDotm(
  config: Config,
  options: BuildNormalDotmOptions,
): Promise<BuildResult> {
  const validation = configSchema.safeParse(config);
  if (!validation.success) {
    throw new ConfigValidationError(validation.error.issues);
  }
  const validConfig = validation.data;

  if (validConfig.platform === 'mac') {
    // The customizations encoding for Command-key shortcuts must come from a real Mac
    // Normal.dotm (T0). We only have the Windows fixture, so refuse to guess.
    throw new FixturesRequiredError('macOS Normal.dotm fixture (Command-key encoding)');
  }

  const invalidCombos = validConfig.bindings
    .filter((binding) => !isComboValidForPlatform(binding.combo, validConfig.platform))
    .map((binding) => binding.id);
  if (invalidCombos.length > 0) {
    throw new InvalidCombosError(invalidCombos);
  }

  const conflicts = unresolvedConflicts(
    detectConflicts(validConfig.bindings, {
      defaults: options.defaults,
      browserBlocked: options.browserBlocked,
      platform: validConfig.platform,
    }),
    options.overrides ?? {},
  );
  if (conflicts.length > 0) {
    throw new UnresolvedConflictsError(conflicts);
  }

  const missing = findMissingTargets(validConfig, {
    commands: options.commands,
    styles: options.styles,
  });
  if (missing.length > 0) {
    throw new MissingTargetsError(missing);
  }

  const problems = validateBasePackage(options.basePackage);
  if (problems.length > 0) {
    throw new PackageStructureError(problems);
  }

  const stylesXml = readTextPart(options.basePackage, 'word/styles.xml') ?? '';
  const styleIndices = resolveStyleIndices(options.styles, extractLatentStyleIndices(stylesXml));

  const customizationsXml = options.renderCustomizations(validConfig.bindings, {
    platform: validConfig.platform,
    keycodes: options.keycodes,
    commands: options.commands,
    styles: options.styles,
    styleIndices,
  });

  const zip = new JSZip();
  for (const [path, content] of Object.entries(options.basePackage)) {
    zip.file(path, content);
  }
  zip.file(CUSTOMIZATIONS_PART, customizationsXml);

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
    mimeType: TEMPLATE_MIME_TYPE,
  });

  return { blob, fileName: 'Normal.dotm' };
}
