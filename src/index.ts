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
    }
};

/**
 * The YACLIL API
 * @param options Options for the app
 */
export function yaclil(options: YaclilOptions) {
    options.advanced ??= {};
}
