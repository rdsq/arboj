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
     * Args for the option (optional)
     * Names of the args
     */
    args?: string[]
};

/**
 * The options that will be returned to handler
 */
export interface OptionResult extends Option {
    /**
     * Values of the args of the options
     */
    argValues: {
        [key: string]: string
    }
}
