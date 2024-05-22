import type { Command } from "./command";
import type { Option } from "./option";

export type ParsedOption = {
    option: Option,
    args: { [key: string]: string | null },
};

export type ParsedCommand = {
    command: Command,
    options: ParsedOption[],
    unexpectedOptions: string[],
    unexpectedOptionsShort: string[],
    args: { [key: string]: string },
    unexpectedArgs: string[],
    treePath: string[],
    helpOption: boolean,
};
