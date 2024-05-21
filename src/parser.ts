import type { Command } from "./types/command";
import type { Option } from "./types/option";
import type { ParsedCommand, ParsedOption } from "./types/parsed";

/**
 * Turn option to parsed option
 * @param option The option
 * @returns The parsed option
 */
function optionToParsedOption(option: Option): ParsedOption {
    return {
        option: option,
        args: {}
    };
}

/**
 * Calculate count of the expected arguments left for some option
 * @param parsedOption The parsed option
 * @returns The number of the expected arguments left
 */
function getOptionArgsLeft(parsedOption: ParsedOption): number {
    const option = parsedOption.option;
    const expected = option.args?.length ?? 0;
    const has = Object.keys(parsedOption.args).length;
    return expected - has;
}

/**
 * Automatically fill the next expected argument for parsed option
 * @param option The parsed option to fill
 * @param arg The argument value
 */
function fillNextOptionArg(option: ParsedOption, arg: string): void {
    const argNames = option.option.args ?? [];
    const count = Object.keys(option.args).length;
    const argName = argNames[count];
    option.args[argName] = arg;
}

/**
 * Process option input
 * @param returning The parsed command object
 * @param arg The current argv arg
 */
function processOption(returning: ParsedCommand, arg: string): void {
    // arg is the full option name with -- or -
    let optionName: string;
    let isShort: boolean;
    if (arg.startsWith("--")) {
        // for full options
        isShort = false;
        optionName = arg.slice(2);
    } else {
        // for short options
        isShort = true;
        optionName = arg.slice(1);
    }
    // find the option
    const option = returning.command.options ? returning.command.options.find(
        value => (isShort ? value.shortName : value.name) === arg
    ) : null;
    if (option) {
        // put it into the list of options
        returning.options.push(optionToParsedOption(option));
    } else {
        // put it into the list of unexpected options
        // depending on its kind
        (isShort ? returning.unexpectedOptionsShort :
            returning.unexpectedOptions).push(optionName);
    }
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
    /** The parsed command object */
    const returning: ParsedCommand = {
        command: rootCommand,
        args: {} as { [key: string]: string },
        unexpectedArgs: [] as string[],
        options: [] as ParsedOption[],
        unexpectedOptions: [] as string[],
        unexpectedOptionsShort: [] as string[],
    };
    let searchingForCommand = true;
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].startsWith('-')) {
            // for options
            processOption(returning, argv[i]);
            searchingForCommand = false;
        } else {
            const latestOption: ParsedOption | undefined = returning.options[returning.options.length - 1];
            if (latestOption && getOptionArgsLeft(latestOption) > 0) {
                // if an option requires args
                fillNextOptionArg(latestOption, argv[i]);
            } else {
                // is this arg a command
                const commandFound = (returning.command.subcommands ?? []).find(
                    value => value.name === argv[i]
                );
                if (commandFound) {
                    // then switch to it
                    returning.command = commandFound;
                } else {
                    // or it is an arg to this command
                    searchingForCommand = false;
                    const commandArgs = returning.command.args ?? [];
                    const foundArgsCount = Object.keys(returning.args).length;
                    if (foundArgsCount >= commandArgs.length) {
                        // if the command has all of its args
                        returning.unexpectedArgs.push(argv[i]);
                    } else {
                        // if it is expecting arguments
                        const argName = commandArgs[foundArgsCount];
                        returning.args[argName] = argv[i];
                    }
                }
            }
        }
    }
    return returning;
}
