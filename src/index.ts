import { getHelpCommand, renderHelp } from "./help/help";
import { parseCommand } from "./parser";
import type { Command } from "./types/command";
import type { ParsedCommand } from "./types/parsed";

export type YaclilOptions = {
    /**
     * Yaclil treats the whole CLI as a recursive command
     * that has its subcommands, options, args.
     * This is that command
     */
    rootCommand: Command,
    /**
     * Advanced options. You don't need them in most cases.
     */
    advanced?: {
        /**
         * Enable or disable `--help` and `-h` options in the app.
         * `true` by default
         */
        helpOptions?: boolean,
        /**
         * Custom argv, mostly for testing.
         * Don't forget to set first two args to something useless,
         * because it will slice them
         */
        argv?: string[],
        /**
         * Allow args, that were not expected by this command.
         * `false` by default
         */
        allowUnexpectedArgs?: boolean,
        /**
         * Allow options that were not expected by the command.
         * `false` by default
         */
        allowUnexpectedOptions?: boolean,
    }
};

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
    });
    // check for unexpected
    checkForUnexpected(parsed, options);
    // help
    const helpOptionIndex = parsed.options.findIndex(
        value => value.option.name === "help"
    );
    // get the configured value of include help feature, or `true` by default
    const helpConfigValue = parsed.command.helpOption ?? options.advanced.helpOptions ?? true;
    if (helpOptionIndex !== -1 && helpConfigValue) {
        // remove the help option
        parsed.options.splice(helpOptionIndex, 1);
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
export function returnError(message: string) {
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
    } else if (parsed.command.handler === null) {
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
