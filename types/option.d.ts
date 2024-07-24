import { ParsedStandaloneOption } from "./parsed";

export type OptionArg = {
    name: string,
    required?: boolean,
};

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
    /** Argument for the option, for example `--example=example` */
    arg?: OptionArg,
    /** Optional handler to make this option standalone */
    standaloneHandler?: (event: ParsedStandaloneOption) => any;
};
