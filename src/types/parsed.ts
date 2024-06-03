import type { Command } from "./command";
import type { Option } from "./option";

export type ParsedOption = {
    option: Option,
    args: { [key: string]: string },
};

export type ParsedCommand = {
    command: Command,
    options: { [key: string]: ParsedOption | undefined },
    unexpectedOptions: string[],
    unexpectedOptionsShort: string[],
    args: { [key: string]: string },
    unexpectedArgs: string[],
    treePath: string[],
    helpOption: boolean,
    rootCommand: Command,
};
