import { FixturesRequiredError } from '@/domain/errors';
import type { Command, KeycodeTable, Platform, ShortcutBinding, Style } from '@/domain/types';
import { encodeKcmPrimary, encodeStyleArgument } from './keymapEncoding';

export interface RenderContext {
  platform: Platform;
  keycodes: KeycodeTable;
  commands: Command[];
  styles: Style[];
  /** Catalog style id -> zero-based latent style index. */
  styleIndices: Record<string, number>;
}

export type CustomizationsRenderer = (
  bindings: ShortcutBinding[],
  context: RenderContext,
) => string;

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const TCP_OPEN =
  '<wne:tcg xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml">';

function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/**
 * Writes `word/customizations.xml` using the structure transcribed from the T0 fixture
 * (Windows Word 2021). Command entries use `wne:fci`; Style entries use `wne:acd` plus a
 * matching entry in `wne:toolbars/wne:acdManifest` and `wne:acds`.
 */
export const renderCustomizations: CustomizationsRenderer = (bindings, context) => {
  const keymapEntries: string[] = [];
  const acdEntries: Array<{ name: string; argValue: string }> = [];

  for (const binding of bindings) {
    const kcmPrimary = encodeKcmPrimary(binding.combo, context.keycodes);
    const target = binding.target;

    if (target.kind === 'command') {
      const command = context.commands.find((candidate) => candidate.id === target.commandId);
      if (!command) {
        throw new FixturesRequiredError(`command ${target.commandId}`);
      }
      keymapEntries.push(
        `<wne:keymap wne:kcmPrimary="${kcmPrimary}"><wne:fci wne:fciName="${escapeAttribute(
          command.wordName,
        )}" wne:swArg="0000"/></wne:keymap>`,
      );
      continue;
    }

    const style = context.styles.find((candidate) => candidate.id === target.styleId);
    if (!style) {
      throw new FixturesRequiredError(`style ${target.styleId}`);
    }
    const styleIndex = context.styleIndices[style.id];
    if (styleIndex === undefined) {
      throw new FixturesRequiredError(
        `latent style index for "${style.wordName}" in word/styles.xml`,
      );
    }

    const acdName = `acd${acdEntries.length}`;
    acdEntries.push({ name: acdName, argValue: encodeStyleArgument(styleIndex) });
    keymapEntries.push(
      `<wne:keymap wne:kcmPrimary="${kcmPrimary}"><wne:acd wne:acdName="${acdName}"/></wne:keymap>`,
    );
  }

  const parts = [
    `${XML_DECLARATION}\r\n${TCP_OPEN}`,
    `<wne:keymaps>${keymapEntries.join('')}</wne:keymaps>`,
  ];

  if (acdEntries.length > 0) {
    parts.push(
      `<wne:toolbars><wne:acdManifest>${acdEntries
        .map((entry) => `<wne:acdEntry wne:acdName="${entry.name}"/>`)
        .join('')}</wne:acdManifest></wne:toolbars>`,
    );
    parts.push(
      `<wne:acds>${acdEntries
        .map(
          (entry) =>
            `<wne:acd wne:argValue="${entry.argValue}" wne:acdName="${entry.name}" wne:fciIndexBasedOn="0065"/>`,
        )
        .join('')}</wne:acds>`,
    );
  }

  parts.push('</wne:tcg>');
  return parts.join('');
};
