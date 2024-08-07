import type { Option } from "./option.d.ts";
import type { Arg } from "./arg.d.ts";
import type { ParsedCommand } from "./parsed.d.ts";

export type CommandDefinition = {
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
    subcommands?: {
        [key: string]: Command,
    },
    /**
     * The function that will handle this command.
     * Set to `null` for commands that exist only for subcommands
     */
    handler: ((event: ParsedCommand) => void) | null,
    /**
     * Expected args of this command
     */
    args?: Arg[],
    /**
     * Allow args, that were not expected by this command
     * @default false
     */
    allowUnexpectedArgs?: boolean,
    /**
     * Allow options that were not expected by the command
     * @default false
     */
    allowUnexpectedOptions?: boolean,
    /**
     * Hide the command from help, tree graph and maybe other features
     * It will still be accessible
     * @default false
     */
    hidden?: boolean,
    /**
     * Hide command's subcommands from things like tree graph
     */
    hideSubcommands?: boolean,
};

export type DynamicCommand = {
    /** Function that loads a command */
    dynamicLoader: () => Command | Promise<Command>,
};

export type Command = CommandDefinition | DynamicCommand;
