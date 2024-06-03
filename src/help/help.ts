import type { Command } from "../types/command";
import type { Option } from "../types/option";
import { ParsedCommand } from "../types/parsed.js";
import { renderCommandOptions } from "./options.js";
import { renderCommandSubcommands } from "./subcommands.js";

/** Separator for the help */
const separator = '\n\n';

/**
 * Render the usage string from some command
 * @param treePath The path to the command like `['my-cli', 'my-command']`
 * including this command
 * @param command The command to get usage from
 * @returns The result string like `my-cli my-command <arg> <additional...>`
 */
export function renderCommandUsage(treePath: string[], command: Command): string {
    if (command.handler === null) {
        return '(not callable)';
    }
    const result: string[] = ['Usage:'];
    result.push(...treePath); // add the tree path
    for (const arg of command.args ?? []) {
        result.push(`<${arg}>`);
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
    result.push(`--${option.name}`);
    for (const arg of option.args ?? []) {
        result.push(`<${arg}>`);
    }
    return result.join(' ');
}

/**
 * Render the full help string for some command
 * @param treePath The tree path to the command
 * @param command The command
 * @returns The full string
 */
export function renderCommandHelp(treePath: string[], command: Command): string {
    const result: string[] = [];
    // usage
    const usage = renderCommandUsage(treePath, command);
    result.push(usage);
    // description
    const description = command.description;
    if (description) result.push(description);
    // subcommands
    const subcommands = renderCommandSubcommands(command);
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
export function renderHelp(parsedCommand: ParsedCommand): string {
    const { options, treePath, command } = parsedCommand;
    const optionsCount = Object.keys(options).length;
    if (optionsCount === 0) {
        // for command only
        return renderCommandHelp(treePath, command);
    } else if (optionsCount === 1) {
        // for option only
        return renderOptionHelp(treePath, Object.values(options)[0]!.option);
    } else {
        // for command and multiple options
        const result: string[] = [];
        // command help
        result.push(renderCommandHelp(treePath, command));
        for (const option of Object.values(options)) {
            // options help
            result.push(renderOptionHelp(treePath, option!.option))
        }
        return result.join(separator);
    }
}

/**
 * Get the help command for some command
 * @param parsed The parser result
 * @returns Something like `my-cli my-command --help`
 */
export function getHelpCommand(parsed: ParsedCommand): string {
    const result: string[] = [];
    result.push(...parsed.treePath);
    result.push('--help');
    return result.join(' ');
}
