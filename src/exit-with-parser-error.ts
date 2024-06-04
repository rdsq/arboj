import exitWithError from "./exit-with-error.js";
import { getHelpCommand } from "./help/help.js";
import { Option } from "./types/option.js";
import { ParsedCommand, ParsedOption } from "./types/parsed.js";

export function exitWithParserError(message: string, parsed: ParsedCommand): never {
    exitWithError(
        message
        + `\nUse "${getHelpCommand(parsed)}" to get help on this command`
    )
}

/**
 * Throw an error that some option is missing its required args (if it is)
 * @param option Option declaration by developer of this app
 * @param parsedOption Option that is missing some arguments
 * @param parsedCommand Parsed command by parser
 */
export function errorIfNotEnoughOptionArgs(parsedOption: ParsedOption, parsedCommand: ParsedCommand): void | never {
    const hasArgs = Object.keys(parsedOption.args).length;
    const expectedArgs = parsedOption.option.args?.length ?? 0;
    const missing: string[] = [];
    // start from provided args count
    for (let i = hasArgs; i < expectedArgs; i++) {
        const arg = (parsedOption.option.args ?? [])[i];
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
    // if there are no required args
    if (missing.length === 0) {
        return;
    }
    // throw error
    exitWithParserError(
        `Error: option "${parsedOption.option.name}" expected, but not received arguments: ${missing.join(', ')}`,
        parsedCommand
    );
}
