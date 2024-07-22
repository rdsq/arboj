import assert from "assert";
import { exitWithErrorInternal } from "./exit-with-error-internal.js";
import { Option, Command, Arg, YaclilOptions, ParsedCommand, ParsedOption, ParsedOptions } from "../types.js";
import { ParsedArgs, ParsedStandaloneOption } from "../types/parsed.js";

function checkIsHelp(option: string) {
    return option === '--help' || option === '-h';
}

/**
 * I copied it from the internet
 */
function isNumeric(value: string) {
    return /^-?\d+$/.test(value);
}

function getArgName(arg: Arg | string) {
    if (typeof arg === 'string') {
        return arg;
    } else {
        return arg.name;
    }
}

function isArgRequired(arg: Arg | string): boolean {
    if (typeof arg === 'string') {
        return false;
    } else {
        return arg.required ?? false;
    }
}

function isOption(element: string) {
    return element.startsWith('-') && !isNumeric(element) && element !== '-';
}

export default class Parser {
    rootCommand: Command;
    initOptions: YaclilOptions;
    argv: string[];

    currentCommand: Command;
    currentOption: ParsedOption | null;
    commandSearchStopped: boolean;
    options: ParsedOptions;
    args: string[];
    argsForCurrentOption: string[];
    processedArgsForCurrentCommand: ParsedArgs;
    unexpectedOptions: string[];
    unexpectedOptionsShort: string[];
    unexpectedArgs: string[];
    currentOptionExpectsArgs: number;
    currentCommandExpectsArgs: number;
    treePath: string[];
    optionsProcessingEnabled: boolean;
    standaloneOptionName: string | null;
    globalOptions: Option[];

    constructor(options: {
        rootCommand: Command,
        rootCommandName: string,
        initOptions: YaclilOptions,
        argv: string[],
        globalOptions: Option[],
    }) {
        this.rootCommand = options.rootCommand;
        this.initOptions = options.initOptions;
        this.argv = options.argv;
        this.treePath = [ options.rootCommandName ];
        this.globalOptions = options.globalOptions ?? [];

        this.currentCommand = this.rootCommand;
        this.currentOption = null;
        this.commandSearchStopped = false;
        this.options = {};
        this.args = [];
        this.argsForCurrentOption = [];
        this.processedArgsForCurrentCommand = {};
        this.unexpectedOptions = [];
        this.unexpectedOptionsShort = [];
        this.unexpectedArgs = [];
        this.currentOptionExpectsArgs = 0;
        this.currentCommandExpectsArgs = 0;
        this.optionsProcessingEnabled = true;
        this.standaloneOptionName = null;
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

    setExpectedCommandArgsCount(command: Command) {
        this.currentCommandExpectsArgs = command.args?.length ?? 0;
    }

    setExpectedOptionArgsCount(option: Option) {
        this.currentOptionExpectsArgs = option.args?.length ?? 0;
    }

    processOption(option: string): void {
        // for disabling further options processing
        if (option === '--') {
            this.optionsProcessingEnabled = false;
            this.commandSearchStopped = true;
            return;
        }
        const isFullName = option.startsWith("--");
        let processedOption = isFullName ? option.substring(2) : option.substring(1);
        let thisOption: Option | undefined;
        // search
        const searchBy: keyof Option = isFullName ? 'name' : 'shortName';
        const searchFunc = (value: Option) => value[searchBy] === processedOption;
        const currentCommandOptions = this.currentCommand.options ?? [];
        thisOption = currentCommandOptions.find(
            searchFunc
        ) ?? this.globalOptions.find(searchFunc);
        // find it in command's options or in global options
        if (thisOption === undefined) {
            if (this.unexpectedOptionsAllowed) {
                if (isFullName) {
                    this.unexpectedOptions.push(processedOption);
                } else {
                    this.unexpectedOptionsShort.push(processedOption);
                }
            } else {
                exitWithErrorInternal(
                    `Error: unexpected option "${option}"`,
                    this.treePath,
                );
            }
        } else {
            // if there is an option
            const parsedOption = {
                option: thisOption,
                args: {},
            };
            this.options[thisOption.name] = parsedOption;
            this.commandSearchStopped = true;
            this.currentOption = parsedOption;
            this.setExpectedOptionArgsCount(thisOption);
            if (thisOption.standaloneHandler && !this.standaloneOptionCalled) {
                // if this is a standalone option, and first one
                this.standaloneOptionName = thisOption.name;
            }
        }
    }

    isItACommand(element: string): boolean {
        // if the search has been stopped
        if (this.commandSearchStopped) return false;
        // if it is in subcommands
        if (element in (this.currentCommand.subcommands ?? {})) return true;
        // or no
        return false;
    }

    processCommand(arg: string) {
        assert(this.currentCommand.subcommands, `Subcommand "${arg}" does not exist`);
        this.currentCommand = this.currentCommand.subcommands[arg];
        this.treePath.push(arg);
        this.setExpectedCommandArgsCount(this.currentCommand);
    }

    processArg(arg: string) {
        // if help or standalone option, ignore any errors
        if (this.standaloneOptionCalled) return;
        if (this.currentOptionExpectsArgs > 0) {
            // args for options
            this.argsForCurrentOption.push(arg);
            this.currentOptionExpectsArgs--;
            if (this.currentOptionExpectsArgs === 0) {
                // if all args were provided
                this.setArgsForOption();
            }
            return;
        }
        if (this.currentCommandExpectsArgs > 0) {
            // args for commands
            this.args.push(arg);
            this.currentCommandExpectsArgs--;
            return;
        }
        if (this.unexpectedArgsAllowed) {
            // if unexpected args are allowed
            this.unexpectedArgs.push(arg);
	    return;
        }
        // else print error
        exitWithErrorInternal(
            `Error: unexpected argument "${arg}"`,
            this.treePath,
        )
    }

    setArgsForOption() {
        // if standalone option, ignore any errors
        if (this.standaloneOptionCalled) return;
        if (this.currentOption === null) return;
        const option = this.currentOption;
        if (option.option.args) {
            // if args are defined
            for (let i = 0; i < option.option.args.length; i++) {
                const arg = option.option.args[i];
                const argName = getArgName(arg);
                const providedArg = this.argsForCurrentOption[i];
                if (!providedArg && isArgRequired(arg)) {
                    // if arg was not provided and it is required
                    exitWithErrorInternal(
                        `Error: required argument "${argName}" was not provided`,
                        this.treePath,
                    );
                }
                this.currentOption.args[argName] = providedArg;
            }
        }
        this.argsForCurrentOption = []; // clean it
    }

    setArgsForCommand() {
        // if standalone option, ignore any errors
        if (this.standaloneOptionCalled) return;
        const command = this.currentCommand;
        const args: ParsedArgs = {};
        if (command.args) {
            for (let i = 0; i < command.args.length; i++) {
                const arg = command.args[i];
                const argName = getArgName(arg);
                const providedArg = this.args[i];
                if (!providedArg) {
                    if (isArgRequired(arg)) {
                        exitWithErrorInternal(
                            `Error: required argument "${argName}" was not provided`,
                            this.treePath,
                        );
                    }
                }
                args[argName] = providedArg;
            }
        }
        this.processedArgsForCurrentCommand = args;
    }

    parse(): void {
        this.setExpectedCommandArgsCount(this.currentCommand);
        for (const arg of this.argv) {
            if (!this.optionsProcessingEnabled) {
                this.processArg(arg);
                continue;
            }
            if (isOption(arg)) {
                this.setArgsForOption(); // set args for previous option
                this.processOption(arg);
                continue;
            }
            if (!this.commandSearchStopped && arg in (this.currentCommand.subcommands ?? {})) {
                this.setArgsForOption(); // set args for previous option
                this.processCommand(arg);
                continue;
            }
            // else
            this.processArg(arg);
        }
        if (this.currentOptionExpectsArgs > 0) this.setArgsForOption();
        this.setArgsForCommand();
    }

    get parsedObject(): ParsedCommand {
        return {
            rootCommand: this.rootCommand,
            command: this.currentCommand,
            treePath: this.treePath,
            unexpectedOptions: this.unexpectedOptions,
            unexpectedArgs: this.unexpectedArgs,
            options: this.options,
            unexpectedOptionsShort: this.unexpectedOptionsShort,
            args: this.processedArgsForCurrentCommand,
            appName: this.treePath[0],
            initOptions: this.initOptions,
            argv: this.argv,
        };
    }

    get standaloneOptionCalled(): boolean {
        return this.standaloneOptionName !== null;
    }

    get parsedStandaloneOption(): ParsedStandaloneOption {
        if (this.standaloneOptionName === null) {
            throw new Error('Attempted to get parsed standalone option when it was not called')
        }
        return {
            parsedCommand: this.parsedObject,
            parsedOption: this.options[this.standaloneOptionName],
        };
    }
}
