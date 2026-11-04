import type { Command, LocalizedText, ShortcutBinding, Style, Target } from '@/domain/types';

export interface TargetInfo {
  kind: 'command' | 'style';
  name: LocalizedText;
  wordName: string;
}

export function findCommand(commands: Command[], id: string): Command | undefined {
  return commands.find((command) => command.id === id);
}

export function findStyle(styles: Style[], id: string): Style | undefined {
  return styles.find((style) => style.id === id);
}

export function targetInfo(
  target: Target,
  commands: Command[],
  styles: Style[],
): TargetInfo | undefined {
  if (target.kind === 'command') {
    const command = findCommand(commands, target.commandId);
    if (!command) {
      return undefined;
    }
    return { kind: 'command', name: command.name, wordName: command.wordName };
  }
  const style = findStyle(styles, target.styleId);
  if (!style) {
    return undefined;
  }
  return { kind: 'style', name: style.name, wordName: style.wordName };
}

export function targetKey(target: Target): string {
  return target.kind === 'command' ? `command:${target.commandId}` : `style:${target.styleId}`;
}

export function findBindingForTarget(
  bindings: ShortcutBinding[],
  target: Target,
): ShortcutBinding | undefined {
  const key = targetKey(target);
  return bindings.find((binding) => targetKey(binding.target) === key);
}
