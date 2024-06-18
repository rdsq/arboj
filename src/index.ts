import { renderHelp } from "./help/help.js";
import { parseCommand } from "./parser";
import type { YaclilOptions } from "./types/init.js";
import exitWithError from "./exit-with-error.js";
import { exitWithErrorInternal } from "./exit-with-error-internal.js";
import type { Command } from "./types/command.js";

/**
 * The YACLIL API
 * @param options Options for the app
 */
export function yaclil(rootCommand: Command, rootCommandName: string, options?: YaclilOptions): void | never {
    options ??= {};
    const argv = options.customArgv ?? process.argv;
    // call the parser
    const parsed = parseCommand({
        rootCommand,
        rootCommandName,
        initOptions: options,
        // remove the first two arguments
        argv: argv.slice(2)
    });
    // get the configured value of include help feature, or `true` by default
    const helpConfigValue = parsed.command.helpOption ?? options.helpOptions ?? true;
    if (parsed.helpOption && helpConfigValue) {
        // return the help string
        console.log(renderHelp(parsed));
    } else {
        // if this command is not callable
        if (!parsed.command.handler) {
            exitWithErrorInternal(
                'Error: this command is not callable',
                parsed.treePath
            );
        }
        // if everything is ok
        parsed.command.handler(parsed);
    }
}

// reexport types
export { Command } from './types/command.js';
export { Option } from './types/option.js';
export { ParsedCommand, ParsedOption } from './types/parsed.js';
export { YaclilOptions } from './types/init.js';
export { Handler } from './types/handler.js';
export { Arg } from './types/arg.js';

// reexport graph
export { treeGraph } from './tree-graph.js';

// reexport `exitWithError`
/**
 * @deprecated Use `exitWithError` instead
 */
export const returnError = exitWithError;
export { exitWithError };
