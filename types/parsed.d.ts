import type { Command } from "./command";
import type { Option } from "./option";

export type ParsedOption = {
    /** The declaration of the option */
    option: Option,
    /** Arguments to this option */
    args: ParsedArgs,
};

export type ParsedOptions = { [key: string]: ParsedOption };

export type ParsedArgs = { [key: string]: string };

export type ParsedCommand = {
    /** The command that was called */
    command: Command,
    /** Called options of this command */
    options: ParsedOptions,
    /** Options that were not expected by this command
     * (only if `allowUnexpectedOptions` is set on `true`) */
    unexpectedOptions: string[],
    /** Options that were not expected by this command, but in format like `-e`
     * (only if `allowUnexpectedOptions` is set on `true`) */
    unexpectedOptionsShort: string[],
    /** Arguments expected by this command */
    args: ParsedArgs,
    /** Arguments that were not expected by this command
     * (only if `allowUnexpectedArgs` is set on `true`) */
    unexpectedArgs: string[],
    /** Tree path to this command, like `['cli-name', 'command', 'this-command']` */
    treePath: string[],
    /** The root command, that was passed to the `yaclil` function as the first argument */
    rootCommand: Command,
    /** Basically the same as `treePath[0]` */
    appName: string,
};

export type ParsedStandaloneOption = {
    /** Parsed command, where the option was called */
    parsedCommand: ParsedCommand,
    /** This parsed option */
    parsedOption: ParsedOption,
};
