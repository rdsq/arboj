/**
 * Args that can be used in commands and options
 */
export type Arg = {
    /** Name of the argument */
    name: string,
    /**
     * Is this argument required (would it cause an error if not provided)
     * @default false
     */
    required?: boolean,
};
