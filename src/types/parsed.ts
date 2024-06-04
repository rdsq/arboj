import type { Command } from "./command";
import type { Option } from "./option";

export type ParsedOption = {
    option: Option,
    args: { [key: string]: string },
};

export type ParsedOptions = { [key: string]: ParsedOption };

export type ParsedCommand = {
    command: Command,
    options: ParsedOptions,
    unexpectedOptions: string[],
    unexpectedOptionsShort: string[],
    args: { [key: string]: string },
    unexpectedArgs: string[],
    treePath: string[],
    helpOption: boolean,
    rootCommand: Command,
};
