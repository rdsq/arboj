import type { Command } from "./command";
import type { Option } from "./option";

export type ParsedOption = {
    option: Option,
    args: ParsedArgs,
};

export type ParsedOptions = { [key: string]: ParsedOption };

export type ParsedArgs = { [key: string]: string };

export type ParsedCommand = {
    command: Command,
    options: ParsedOptions,
    unexpectedOptions: string[],
    unexpectedOptionsShort: string[],
    args: ParsedArgs,
    unexpectedArgs: string[],
    treePath: string[],
    helpOption: boolean,
    rootCommand: Command,
};
