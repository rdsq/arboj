import { getHelpCommand, renderHelp } from "./help/help.js";
import { parseCommand } from "./parser";
import type { ParsedCommand } from "./types/parsed.js";
import type { YaclilOptions } from "./types/init.js";

/**
 * The YACLIL API
 * @param options Options for the app
 */
export function yaclil(options: YaclilOptions) {
    options.advanced ??= {};
    const argv = options.advanced.argv ?? process.argv;
    // call the parser
    const parsed = parseCommand({
        // remove the first two arguments
        argv: argv.slice(2),
        rootCommand: options.rootCommand,
        helpEnabledGlobally: options.advanced.helpOptions
    });
    // check for unexpected
    checkForUnexpected(parsed, options);
    // get the configured value of include help feature, or `true` by default
    const helpConfigValue = parsed.command.helpOption ?? options.advanced.helpOptions ?? true;
    if (parsed.helpOption && helpConfigValue) {
        // return the help string
        console.log(renderHelp(parsed));
    } else {
        // if everything is ok
        parsed.command.handler!(parsed);
    }
}

/**
 * Exit with error status
 * @param message The error message
 */
export function returnError(message: string): never {
    console.error(message);
    process.exit(1);
}

function checkForUnexpected(parsed: ParsedCommand, options: YaclilOptions): void {
    options.advanced ??= {};
    const allowUnexpectedArgs = parsed.command.allowUnexpectedArgs
    ?? options.advanced.allowUnexpectedArgs ?? false;
    const allowUnexpectedOptions = parsed.command.allowUnexpectedOptions
    ?? options.advanced.allowUnexpectedOptions ?? false;

    const unexpectedArgs = Object.keys(parsed.unexpectedArgs).length;
    const unexpectedOptions = Object.keys(parsed.unexpectedOptions).length
    + Object.keys(parsed.unexpectedOptionsShort).length;

    let errorMessage: string | null = null;

    if (!allowUnexpectedArgs && unexpectedArgs > 0) {
        // args
        const args = parsed.unexpectedArgs.join(', ');
        errorMessage = `Error: unexpected arguments: ${args}`;
    } else if (!allowUnexpectedOptions && unexpectedOptions) {
        // options
        const optionsRaw = parsed.unexpectedOptions.map(
            value => `--${value}`
        );
        optionsRaw.push(...parsed.unexpectedOptionsShort.map(
            value => `-${value}`
        ));
        const options = optionsRaw.join(", ");
        errorMessage = `Error: unexpected options: ${options}`
    } else if (parsed.command.handler === null && !parsed.helpOption) {
        // if this command is only for subcommands
        errorMessage = "Error: this command is not callable";
    }

    if (errorMessage) {
        returnError(
            errorMessage
            + `\nUse "${getHelpCommand(parsed)}" to get help on this command`
        );
    }
}

// reexport types
export { Command } from './types/command.js';
export { Option } from './types/option.js';
export { ParsedCommand, ParsedOption } from './types/parsed.js';
export { YaclilOptions } from './types/init.js';
export { Handler } from './types/handler.js';

// reexport graph
export { treeGraph } from './tree-graph.js';
