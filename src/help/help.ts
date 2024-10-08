import type {
    Arg,
    CommandDefinition,
    Option,
    ParsedCommand,
} from '../../types.d.ts';
import { renderCommandOptions } from './options.ts';
import { renderCommandSubcommands } from './subcommands.ts';

/** Separator for the help */
const separator = '\n\n';

function argName(arg: Arg | string): string {
    if (typeof arg === 'string') {
        return arg;
    } else {
        return arg.name;
    }
}

/**
 * Render the usage string from some command
 * @param treePath The path to the command like `['my-cli', 'my-command']`
 * including this command
 * @param command The command to get usage from
 * @returns The result string like `my-cli my-command <arg> <additional...>`
 */
export function renderCommandUsage(
    treePath: string[],
    command: CommandDefinition,
): string {
    if (command.handler === null) {
        return '(not callable)';
    }
    const result: string[] = ['Usage:'];
    result.push(...treePath); // add the tree path
    for (const arg of command.args ?? []) {
        // for both string and object arg declarations
        result.push(`<${argName(arg)}>`);
    }
    if (command.additionalUsage) result.push(command.additionalUsage);
    return result.join(' ');
}

/**
 * Render the usage string for some option
 * @param treePath The path to the command of this option
 * @param option The option
 * @returns The usage string of the option
 */
export function renderOptionUsage(treePath: string[], option: Option): string {
    const result: string[] = [];
    result.push(...treePath);
    let optionItself = `--${option.name}`;
    if (option.arg) {
        optionItself += `=<${option.arg.name}>`;
    }
    result.push(optionItself);
    if (option.standaloneHandler) {
        result.push(' (standalone)');
    }
    return result.join(' ');
}

/**
 * Render the full help string for some command
 * @param treePath The tree path to the command
 * @param command The command
 * @returns The full string
 */
export async function renderCommandHelp(
    treePath: string[],
    command: CommandDefinition,
): Promise<string> {
    const result: string[] = [];
    // usage
    const usage = renderCommandUsage(treePath, command);
    result.push(usage);
    // description
    const description = command.description;
    if (description) result.push(description);
    // subcommands
    const subcommands: string = await renderCommandSubcommands(command);
    if (subcommands.length > 0) result.push(subcommands);
    // options
    const options = renderCommandOptions(command);
    if (options.length > 0) result.push(options);
    return result.join(separator);
}

/**
 * Render help string for some option
 * @param treePath The path to the command of the option
 * @param option The option
 * @returns The option help string
 */
export function renderOptionHelp(treePath: string[], option: Option): string {
    const result: string[] = [];
    // usage
    const usage = renderOptionUsage(treePath, option);
    result.push(usage);
    // description
    const description = option.description;
    if (description) result.push(description);
    return result.join(separator);
}

/**
 * Render hull help message for some command and options.
 * If this command was called without options, then it renders only command.
 * If with one option, renders only this option help.
 * If multiple options renders help for the command and all these options.
 * @param parsedCommand The result of the parser
 * @returns The result string
 */
export async function renderHelp(
    parsedCommand: ParsedCommand,
): Promise<string> {
    const { treePath, command, options } = parsedCommand;
    const optionsCount = Object.keys(options).length;
    if (optionsCount === 0) {
        // for command only
        return await renderCommandHelp(treePath, command);
    } else if (optionsCount === 1) {
        // for option only
        return renderOptionHelp(treePath, Object.values(options)[0].option);
    } else {
        // for command and multiple options
        const result: string[] = [];
        // command help
        result.push(await renderCommandHelp(treePath, command));
        for (const option of Object.values(options)) {
            // options help
            result.push(renderOptionHelp(treePath, option.option));
        }
        return result.join(separator);
    }
}

/**
 * Get the help command for some command
 * @returns Something like `my-cli my-command --help`
 */
export function getHelpCommand(treePath: string[]): string {
    const result: string[] = [...treePath, '--help'];
    return result.join(' ');
}
