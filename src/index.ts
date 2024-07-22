import { renderHelp } from "./help/help.js";
import { parseCommand } from "./parser";
import exitWithError from "./exit-with-error.js";
import { exitWithErrorInternal } from "./exit-with-error-internal.js";
import type { YaclilOptions, Command } from "../types.js";
import { helpOption } from "./pre.js";

/**
 * The YACLIL API
 * @param options Options for the app
 */
export function yaclil(rootCommand: Command, cliName: string, options?: YaclilOptions): void | never {
    options ??= {};
    const globalOptions = options.globalOptions ?? [
        helpOption,
    ];
    const argv = options.customArgv ?? process.argv;
    // call the parser
    const parser = parseCommand({
        rootCommand,
        rootCommandName: cliName,
        initOptions: options,
        // remove the first two arguments
        argv: argv.slice(2),
        globalOptions,
    });
    const parsed = parser.parsedObject;
    if (parser.standaloneOptionCalled) {
        // if standalone option called
        const parsedForStandalone = parser.parsedStandaloneOption;
        const handler = parsedForStandalone.parsedOption.option.standaloneHandler;
        if (!handler) throw new Error('Impossible error with standalone options');
        // execute standalone option
        handler(parsedForStandalone);
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
export type {
    Command,
    Arg,
    Handler,
    Option,
    ParsedArgs,
    ParsedCommand,
    ParsedOption,
    ParsedOptions,
    YaclilOptions,
} from '../types';

// reexport graph
export { treeGraph } from './tree-graph.js';

// reexport `exitWithError`
/**
 * @deprecated Use `exitWithError` instead
 */
export const returnError = exitWithError;
export { exitWithError };
