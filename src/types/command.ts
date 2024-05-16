import type { Option } from "./option";
import type { Handler } from "./handler";

/**
 * Object type of commands
 */
export type Command = {
    /** Name of the command that will be used to call it */
    name: string,
    /** Description of the command for help */
    description?: string,
    /**
     * Hint for help how to use this command.
     * Does not affect app behavior.
     * Put here everything that will appear after the command.
     * For example, `<name> <options...>`.
     */
    usage?: string,
    /** 
     * Options of the command
     */
    options?: Option[],
    /** 
     * Subcommands of the command
     * For example, `my-cli command subcommand`
     */
    subcommands?: Command[],
    /** 
     * Enable `--help` and `-h` options for this command?
     * `true` by default
     */
    helpOption?: boolean,
    /**
     * The function that will handle this command.
     * Set to `null` for commands that exist only for subcommands
     */
    handler: Handler | null,
    /**
     * Don't call the handler if this command was called with subcommands.
     * `true` by default
     */
    ignoreIfSubcommands?: boolean,
};
