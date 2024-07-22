import type { Command } from "./command";
import { Option } from "./option";

/**
 * The init options for YACLIL
 */
export type YaclilOptions = {
    /**
     * Custom argv, mostly for testing.
     * Don't forget to set first two args to something useless,
     * because the app will delete them automatically
     */
    customArgv?: string[],
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
    /** Global options, by default only `--help -h` */
    globalOptions?: Option[],
};
