import type { Command, CommandDefinition, Option } from "../../types.d.ts";

/**
 * Does some command have options or not
 * @param command The command
 * @returns The result
 */
export function hasOptions(command: CommandDefinition): boolean | undefined {
    return command.options && command.options.length > 0;
}

/**
 * Render the first part of an option table help element
 * @param option The option
 * @returns A string like `--example -e <1>`
 */
export function renderOptionName(option: Option): string {
    let result = `--${option.name}`;
    if (option.shortName) result += ` -${option.shortName}`;
    if (option.arg) result += `=<${option.arg.name}>`;
    if (option.standaloneHandler) result += ' (s)';
    return result;
}

/**
 * Get the max length of options of some command
 * @param command The command to test options from
 * @returns The max length of the first part of the table
 */
export function getMaxOptionsLength(command: CommandDefinition): number {
    if (!hasOptions(command)) return 0;
    let maxLength = 0;
    for (const option of command.options!) {
        const thisLength = renderOptionName(option).length;
        if (thisLength > maxLength) maxLength = thisLength;
    }
    return maxLength;
}

/**
 * Render the full line of some option
 * @param option The option
 * @param maxLength Max length of options of the command
 * @returns The rendered string
 */
export function renderOptionString(option: Option, maxLength: number): string {
    let result = renderOptionName(option);
    if (option.description) {
        const freeSpaceCount = maxLength - result.length + 3;
        const freeSpace = ' '.repeat(freeSpaceCount);
        result += freeSpace + option.description;
    }
    return result;
}

/**
 * Render the full table of options from some command
 * @param command The command
 * @returns The full table
 */
export function renderCommandOptions(command: CommandDefinition): string {
    const result: string[] = [];
    if (!hasOptions(command)) return '(no options)';
    const maxLength = getMaxOptionsLength(command);
    for (const option of command.options!) {
        result.push(renderOptionString(option, maxLength));
    }
    return 'Options:\n  ' + result.join('\n  ');
}
