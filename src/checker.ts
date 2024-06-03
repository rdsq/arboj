import type { ParsedCommand } from "./types/parsed";
import type { YaclilOptions } from "./types/init";
import exitWithError from './exit-with-error.js';
import { getHelpCommand } from "./help/help.js";

/**
 * Internal checker for commands
 * @param parsed Parsed command to check
 * @param options YACLIL init options
 */
export function checkForUnexpected(parsed: ParsedCommand, options: YaclilOptions): void {
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
        exitWithError(
            errorMessage
            + `\nUse "${getHelpCommand(parsed)}" to get help on this command`
        );
    }
}
