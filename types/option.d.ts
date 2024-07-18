import { Arg } from "./arg";

/**
 * Type of options for commands
 */
export type Option = {
    /**
     * Name of the option
     * For example, `example` will be called `--example` in the command line
     */
    name: string,
    /**
     * Short name of the option (optional)
     * For example, `e` will be called `-e` in the command line
     */
    shortName?: string,
    /**
     * The option's description (optional)
     */
    description?: string,
    /**
     * Args for the option (optional)
     */
    args?: (string | Arg)[]
};
