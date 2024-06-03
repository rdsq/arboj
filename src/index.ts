import { renderHelp } from "./help/help.js";
import { parseCommand } from "./parser";
import type { YaclilOptions } from "./types/init.js";
import exitWithError from "./exit-with-error.js";
import { checkForUnexpected } from "./checker.js";

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

// reexport types
export { Command } from './types/command.js';
export { Option } from './types/option.js';
export { ParsedCommand, ParsedOption } from './types/parsed.js';
export { YaclilOptions } from './types/init.js';
export { Handler } from './types/handler.js';

// reexport graph
export { treeGraph } from './tree-graph.js';

// reexport `exitWithError`
/**
 * @deprecated Use `exitWithError` instead
 */
export const returnError = exitWithError;
export { exitWithError };
