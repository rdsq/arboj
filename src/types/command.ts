import type { Option } from "./option";
import type { Handler } from "./handler";
import { Arg } from "./arg";

/**
 * Object type of commands
 */
export type Command = {
    /** Name of the command that will be used to call it.
     * 
     * For root command it will be used only in help
     * and we recommend to set it to the command your CLI is called.
     * For example `my-cli` or `node main` if it doesn't have its bin
     */
    name: string,
    /** Description of the command for help */
    description?: string,
    /**
     * Hint for help how to use this command.
     * Does not affect app behavior.
     * Put here everything that will appear after the command and its args.
     * For example, `<examples...>` to say user that this command expects
     * additional arguments.
     */
    additionalUsage?: string,
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
     * Expected args of this command
     */
    args?: (string | Arg)[],
    /**
     * Allow args, that were not expected by this command.
     * `false` by default
     */
    allowUnexpectedArgs?: boolean,
    /**
     * Allow options that were not expected by the command.
     * `false` by default
     */
    allowUnexpectedOptions?: boolean,
    /**
     * Hide the command from help, tree graph and maybe other features.
     * `false` by default.
     * It will still be accessible
     */
    hidden?: boolean,
};
