import { exitWithErrorInternal } from "./exit-with-error-internal.js";
import { Option, Command, Arg, YaclilOptions, ParsedCommand, ParsedOption, ParsedOptions } from "./types.js";

function checkIsHelp(option: string) {
    return option === '--help' || option === '-h';
}

/**
 * I copied it from the internet
 */
function isNumeric(value: string) {
    return /^-?\d+$/.test(value);
}

export default class Parser {
    rootCommand: Command;
    initOptions: YaclilOptions;
    argv: string[];

    currentCommand: Command;
    commandSearchStopped: boolean;
    options: ParsedOptions;
    args: Arg[];
    unexpectedOptions: string[];
    unexpectedOptionsShort: string[];
    unexpectedArgs: string[];
    currentOptionExpectsArgs: number;
    currentCommandExpectsArgs: number;
    treePath: string[];
    helpCalled: boolean;
    optionsProcessingEnabled: boolean;

    constructor(options: {
        rootCommand: Command,
        rootCommandName: string,
        options: YaclilOptions,
        argv: string[],
    }) {
        this.rootCommand = options.rootCommand;
        this.initOptions = options.options;
        this.argv = options.argv;
        this.treePath = [ options.rootCommandName ];

        this.currentCommand = this.rootCommand;
        this.commandSearchStopped = false;
        this.options = {};
        this.args = [];
        this.unexpectedOptions = [];
        this.unexpectedOptionsShort = [];
        this.unexpectedArgs = [];
        this.currentOptionExpectsArgs = 0;
        this.currentCommandExpectsArgs = 0;
        this.helpCalled = false;
        this.optionsProcessingEnabled = true;
    }

    get unexpectedOptionsAllowed() {
        return this.currentCommand.allowUnexpectedOptions
        ?? this.initOptions.allowUnexpectedOptions
        ?? false;
    }

    get unexpectedArgsAllowed() {
        return this.currentCommand.allowUnexpectedArgs
        ?? this.initOptions.allowUnexpectedArgs
        ?? false;
    }

    processOption(option: string): void {
        // if options are disabled or this option is just a negative number
        if (!this.optionsProcessingEnabled || isNumeric(option)) {
            // process it as an argument
            return;
        };
        // check if this is help
        if (checkIsHelp(option)) {
            this.helpCalled = true;
            return;
        }
        // for disabling further options processing
        if (option === '--') {
            this.optionsProcessingEnabled = false;
            this.commandSearchStopped = true;
            return;
        }
        const isFullName = option.startsWith("--");
        let processedOption = isFullName ? option.substring(2) : option.substring(1);
        let thisOption: Option | undefined;
        if (!this.currentCommand.options) {
            thisOption = undefined;
        } else {
            const searchBy: keyof Option = isFullName ? 'name' : 'shortName';
            thisOption = this.currentCommand.options.find(
                value => value[searchBy] === processedOption
            );
        }
        if (thisOption === undefined) {
            if (this.unexpectedOptionsAllowed) {
                if (isFullName) {
                    this.unexpectedOptions.push(processedOption);
                } else {
                    this.unexpectedOptionsShort.push(processedOption);
                }
            } else {
                exitWithErrorInternal(
                    `Error: unexpected option: ${option}`,
                    this.treePath,
                );
            }
        } else {
            // if there is an option
            this.options[thisOption.name] = {
                option: thisOption,
                args: {},
            };
            this.commandSearchStopped = true;
        }
    }

    parse(): void {}

    get parsedObject(): ParsedCommand {
        return {
            rootCommand: this.rootCommand,
            command: this.currentCommand,
            treePath: this.treePath,
            unexpectedOptions: this.unexpectedOptions,
            unexpectedArgs: this.unexpectedArgs,
            options: this.options,
            helpOption: this.helpCalled,
            unexpectedOptionsShort: this.unexpectedOptionsShort,
        }
    }
}
