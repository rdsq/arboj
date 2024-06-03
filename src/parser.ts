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
    const expectedArgs = option.option.args ?? [];
    const count = Object.keys(option.args).length;
    const nextArg = expectedArgs[count];
    const argName = (typeof nextArg === "string") ? nextArg : nextArg.name;
    option.args[argName] = arg;
}

/**
 * I copied it from the internet
 */
function isNumeric(value: string) {
    return /^-?\d+$/.test(value);
}

/**
 * Process option input
 * @param returning The parsed command object
 * @param arg The current argv arg
 */
function processOption(returning: ParsedCommand, arg: string,
    helpEnabledGlobally: boolean | undefined): void {
    // check if this option is help and help is enabled
    if ((arg == '--help' || arg == '-h') &&
    (returning.command.helpOption ?? helpEnabledGlobally ?? true)) {
        returning.helpOption = true;
        return;
    }
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
        value => (isShort ? value.shortName : value.name) === optionName
    ) : null;
    if (option) {
        // put it into the list of options
        const parsedOption = optionToParsedOption(option);
        returning.options[parsedOption.option.name] = parsedOption;
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
    argv,
    helpEnabledGlobally,
}: {
    rootCommand: Command,
    argv: string[],
    helpEnabledGlobally: boolean | undefined,
}): ParsedCommand {
    /** The parsed command object */
    const returning: ParsedCommand = {
        command: rootCommand,
        args: {} as { [key: string]: string },
        unexpectedArgs: [] as string[],
        options: {} as { [key: string]: ParsedOption },
        unexpectedOptions: [] as string[],
        unexpectedOptionsShort: [] as string[],
        treePath: [ rootCommand.name ] as string[],
        helpOption: false,
        rootCommand,
    };
    // process that argv
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].startsWith('-') && !isNumeric(argv[i]) && argv[i].length > 1) {
            // for options and not negative numbers and not `-`
            processOption(returning, argv[i], helpEnabledGlobally);
        } else {
            const optionsValues = Object.values(returning.options);
            const latestOption: ParsedOption | undefined = optionsValues[optionsValues.length - 1];
            if (latestOption && getOptionArgsLeft(latestOption) > 0) {
                // if the option requires args
                fillNextOptionArg(latestOption, argv[i]);
            } else {
                // is this arg a command
                const commandFound = (returning.command.subcommands ?? []).find(
                    value => value.name === argv[i]
                );
                if (commandFound) {
                    // then switch to it
                    returning.command = commandFound;
                    // add the new command to the tree path
                    returning.treePath.push(commandFound.name);
                } else {
                    // or it is an arg to this command
                    const commandArgs = returning.command.args ?? [];
                    const foundArgsCount = Object.keys(returning.args).length;
                    if (foundArgsCount >= commandArgs.length) {
                        // if the command has all of its args
                        returning.unexpectedArgs.push(argv[i]);
                    } else {
                        // if it is expecting arguments
                        const nextArg = commandArgs[foundArgsCount];
                        // was this arg declared as a string or as an object
                        const argName = (typeof nextArg === "string") ? nextArg : nextArg.name;
                        returning.args[argName] = argv[i];
                    }
                }
            }
        }
    }
    return returning;
}
