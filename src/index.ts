import { renderHelp } from "./help/help";
import { parseCommand } from "./parser";
import type { Command } from "./types/command";

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
        
    }
}
