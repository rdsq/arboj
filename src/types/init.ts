import type { Command } from "./command";

/**
 * The init options for YACLIL
 */
export type YaclilOptions = {
    /**
     * Yaclil treats the whole CLI as a command tree
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
         * because the app will delete them automatically
         */
        argv?: string[],
        /**
         * Allow args, that were not expected by this app's commands.
         * `false` by default
         */
        allowUnexpectedArgs?: boolean,
        /**
         * Allow options that were not expected by this app's commands.
         * `false` by default
         */
        allowUnexpectedOptions?: boolean,
    }
};