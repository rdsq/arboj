import type { Command } from "./command";
import { Option } from "./option";

/**
 * The init options for YACLIL
 */
export type YaclilOptions = {
    /**
     * Custom argv
     * Don't forget remove the first two arguments on node
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
    /** Global options, by default only `--help -h` */
    globalOptions?: Option[],
};
