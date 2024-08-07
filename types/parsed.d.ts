import type { Arg } from "./arg.d.ts";
import type { CommandDefinition } from "./command.d.ts";
import type { YaclilOptions } from "./init.d.ts";
import type { Option } from "./option.d.ts";

export type ParsedOption = {
    /** The declaration of the option */
    option: Option,
    /** Argument to this option. Defined at `option.arg` */
    arg?: string,
};

export type ParsedArg = {
    value: string,
    arg: Arg,
};

export type ParsedOptions = { [key: string]: ParsedOption };

export type ParsedArgs = { [key: string]: ParsedArg };

export type ParsedCommand = {
    /** The command that was called */
    command: CommandDefinition,
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
    rootCommand: CommandDefinition,
    /** Basically the same as `treePath[0]` */
    appName: string,
    /** Options, that were passed to the `yaclil` function as the 3rd argument */
    initOptions: YaclilOptions,
    /** `argv` used to generate this parsed object */
    argv: string[],
};

export type ParsedStandaloneOption = {
    /** Parsed command, where the option was called */
    parsedCommand: ParsedCommand,
    /** This parsed option */
    parsedOption: ParsedOption,
};
