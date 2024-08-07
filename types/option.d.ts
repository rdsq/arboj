import type { Arg } from './arg.d.ts';
import type { ParsedStandaloneOption } from './parsed.d.ts';

/**
 * Type of options for commands
 */
export type Option = {
    /**
     * Name of the option
     * For example, `example` will be called `--example` in the command line
     */
    name: string;
    /**
     * Short name of the option (optional)
     * For example, `e` will be called `-e` in the command line
     */
    shortName?: string;
    /**
     * The option's description (optional)
     */
    description?: string;
    /** Argument for the option, for example `--example=example` */
    arg?: Arg;
    /** Optional handler to make this option standalone */
    standaloneHandler?: (event: ParsedStandaloneOption) => void;
};
