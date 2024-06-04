import type { ParsedCommand } from "./types/parsed";
import type { YaclilOptions } from "./types/init";
import exitWithError from './exit-with-error.js';
import { getHelpCommand } from "./help/help.js";
import { Arg } from "./types/arg";

/**
 * Get an array of args that are required, but were not provided
 * @param expectedArgs `parsed.command.args` or `option.args`
 * @param gotArgs `parsed.args` or `parsedOption.args`
 * @returns Array of args that were not provided
 */
function getRequiredNotProvidedArgs(
    expectedArgs: (string | Arg)[] | undefined,
    gotArgs: { [key: string]: string },
): string[] {
    expectedArgs ??= [];
    const provided = Object.keys(gotArgs);
    const args: string[] = [];
    for (const arg of expectedArgs) {
        if (typeof arg !== 'string' && arg.required) {
            // string args are always not required
            if (provided.indexOf(arg.name) === -1) {
                args.push(arg.name);
            }
        }
    }
    return args;
}

/**
 * Internal checker for commands
 * @param parsed Parsed command to check
 * @param options YACLIL init options
 */
export function checkForUnexpected(parsed: ParsedCommand, options: YaclilOptions): void {
    options.advanced ??= {};

    // required args
    const notProvidedArgs = getRequiredNotProvidedArgs(parsed.command.args, parsed.args);

    let errorMessage: string | null = null;

    if (parsed.command.handler === null && !parsed.helpOption) {
        // if this command is only for subcommands
        errorMessage = "Error: this command is not callable";
    } else if (notProvidedArgs.length > 0) {
        // some of required args were not provided
        const args = notProvidedArgs.join(", ");
        errorMessage = `Error: expected, but not provided arguments: ${args}`;
    }

    if (errorMessage) {
        exitWithError(
            errorMessage
            + `\nUse "${getHelpCommand(parsed)}" to get help on this command`
        );
    }
}
