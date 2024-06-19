import { exitWithErrorInternal } from "./exit-with-error-internal.js";
import type { Command, Option, ParsedCommand, ParsedOption } from "./types";

/**
 * Get required args of a command or option that were expected, but not provided
 * @param parsedVersion Version of a command or option by the parser
 * @param declaredVersion Version that developer of this YACLIL based app declared
 * @returns Required args that were not provided
 */
function getNotProvidedArguments(
    parsedVersion: ParsedCommand | ParsedOption,
    declaredVersion: Command | Option
): string[] {
    const hasArgs = Object.keys(parsedVersion.args).length;
    const expectedArgs = declaredVersion.args?.length ?? 0;
    const missing: string[] = [];
    // start from provided args count
    for (let i = hasArgs; i < expectedArgs; i++) {
        const arg = (declaredVersion.args ?? [])[i];
        // if the arg is required
        if (
            // string args are always not required
            typeof arg !== 'string' &&
            (arg.required ?? false)
        ) {
            // add it
            missing.push(arg.name);
        }
    }
    return missing;
}

/**
 * Throw an error that some option is missing its required args (if it is)
 * @param parsedOption Option that may be missing some arguments
 * @param parsedCommand Parsed command by parser
 */
export function errorIfNotEnoughOptionArgs(parsedOption: ParsedOption, parsedCommand: ParsedCommand): void | never {
    const missing = getNotProvidedArguments(parsedOption, parsedOption.option);
    // if there are no required args
    if (missing.length === 0) {
        return;
    }
    // throw error
    exitWithErrorInternal(
        `Error: option "${parsedOption.option.name}" expected, but not received arguments: ${missing.join(', ')}`,
        parsedCommand.treePath,
    );
}

/**
 * Throw an error that some command is missing its required args (if it is)
 * @param parsedCommand Parsed command by parser that may be missing some arguments
 */
export function errorIfNotEnoughCommandArgs(parsedCommand: ParsedCommand): void | never {
    const missing = getNotProvidedArguments(parsedCommand, parsedCommand.command);
    // if there are no required args
    if (missing.length === 0) {
        return;
    }
    // throw error
    exitWithErrorInternal(
        `Error: expected, but not provided arguments: ${missing.join(', ')}`,
        parsedCommand.treePath,
    );
}
