import type { Option } from "./option.d.ts";

/**
 * The init options for ARBOJ
 */
export type ArbojOptions = {
    /**
     * Custom argv
     * Don't forget remove the first two arguments on node
     */
    argv?: string[],
    /**
     * Allow args, that were not expected by this app's commands
     * @default false
     */
    allowUnexpectedArgs?: boolean,
    /**
     * Allow options that were not expected by this app's commands
     * @default false
     */
    allowUnexpectedOptions?: boolean,
    /** Global options, by default only `--help -h` (`helpOption`) */
    globalOptions?: Option[],
};
