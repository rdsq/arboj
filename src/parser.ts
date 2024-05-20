import type { Command } from "./types/command";
import type { Option } from "./types/option";
import type { ParsedCommand, ParsedOption } from "./types/parsed";

function optionToParsedOption(option: Option): ParsedOption {
    return {
        option: option,
        args: {}
    };
}

function getOptionArgsLeft(parsedOption: ParsedOption): number {
    const option = parsedOption.option;
    const expected = option.args?.length ?? 0;
    const has = Object.keys(parsedOption.args).length;
    return expected - has;
}

function fillNextOptionArg(option: ParsedOption, arg: string): void {
    const argNames = option.option.args ?? [];
    const count = Object.keys(option.args).length;
    const argName = argNames[count];
    option.args[argName] = arg;
}

/**
 * Fully parse the CLI request
 * @param param0 Options for the parser
 * @returns Parsed command that can be passed to handler
 */
export function parseCommand({
    rootCommand,
    argv
}: {
    rootCommand: Command,
    argv: string[]
}): ParsedCommand {
    let currentCommand = rootCommand;
    const foundArgs: { [key: string]: string } = {};
    const foundOptions: ParsedOption[] = [];
    const unexpectedArgs: string[] = [];
    const unexpectedOptions: string[] = [];
    const unexpectedOptionsShort: string[] = [];
    let searchingForCommand = true;
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].startsWith('-')) {
            // options
            const fullOptionName = argv[i];
            let optionName: string;
            let isShort: boolean;
            if (argv[i].startsWith("--")) {
                // for full options
                isShort = false;
                optionName = fullOptionName.slice(2);
            } else {
                // for short options
                isShort = true;
                optionName = fullOptionName.slice(1);
            }
            // find the option
            const option = currentCommand.options ? currentCommand.options.find(
                value => (isShort ? value.shortName : value.name) === fullOptionName
            ) : null;
            if (option) {
                // put it into the list of options
                foundOptions.push(optionToParsedOption(option));
            } else {
                // put it into the list of unexpected options
                // depending on its kind
                (isShort ? unexpectedOptionsShort : unexpectedOptions).push(optionName);
            }
            searchingForCommand = false;
        } else {
            const latestOption: ParsedOption | undefined = foundOptions[foundOptions.length - 1];
            if (latestOption && getOptionArgsLeft(latestOption) > 0) {
                // if an option requires args
                fillNextOptionArg(latestOption, argv[i]);
            } else {
                // is this arg a command
                const commandFound = (currentCommand.subcommands ?? []).find(
                    value => value.name === argv[i]
                );
                if (commandFound) {
                    // then switch to it
                    currentCommand = commandFound;
                } else {
                    // or it is an arg to this command
                    searchingForCommand = false;
                    const commandArgs = currentCommand.args ?? [];
                    const foundArgsCount = Object.keys(foundArgs).length;
                    if (foundArgsCount >= commandArgs.length) {
                        // if the command has all of its args
                        unexpectedArgs.push(argv[i]);
                    } else {
                        // if it is expecting arguments
                        const argName = commandArgs[foundArgsCount];
                        foundArgs[argName] = argv[i];
                    }
                }
            }
        }
    }
    return {
        command: currentCommand,
        args: foundArgs,
        unexpectedArgs: unexpectedArgs,
        options: foundOptions,
        unexpectedOptions,
        unexpectedOptionsShort,
    }
}
