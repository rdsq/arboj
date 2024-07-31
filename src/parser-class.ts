import assert from "node:assert";
import { exitWithErrorInternal } from "./util/exit-with-error-internal.js";
import type { Option, Command, Arg, YaclilOptions, ParsedCommand, ParsedOption, ParsedOptions, ParsedArgs, ParsedStandaloneOption, CommandDefinition } from "../types";
import { navigateSubcommands, resolveDynamic } from "./util.js";

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
    rootCommand!: CommandDefinition;
    initOptions: YaclilOptions;
    argv: string[];

    currentCommand!: CommandDefinition;
    currentOption: ParsedOption | null;
    commandSearchStopped: boolean;
    options: ParsedOptions;
    args: string[];
    processedArgsForCurrentCommand: ParsedArgs;
    unexpectedOptions: string[];
    unexpectedOptionsShort: string[];
    unexpectedArgs: string[];
    currentCommandExpectsArgs: number;
    treePath: string[];
    optionsProcessingEnabled: boolean;
    standaloneOptionName: string | null;
    globalOptions: Option[];

    waitForConstruct: Promise<void>;

    constructor(options: {
        rootCommand: Command,
        rootCommandName: string,
        initOptions: YaclilOptions,
        argv: string[],
        globalOptions: Option[],
    }) {
        this.initOptions = options.initOptions;
        this.argv = options.argv;
        this.treePath = [ options.rootCommandName ];
        this.globalOptions = options.globalOptions ?? [];

        this.currentOption = null;
        this.commandSearchStopped = false;
        this.options = {};
        this.args = [];
        this.processedArgsForCurrentCommand = {};
        this.unexpectedOptions = [];
        this.unexpectedOptionsShort = [];
        this.unexpectedArgs = [];
        this.currentCommandExpectsArgs = 0;
        this.optionsProcessingEnabled = true;
        this.standaloneOptionName = null;

        this.waitForConstruct = (async() => {
            this.rootCommand = await resolveDynamic(options.rootCommand);
            this.currentCommand = this.rootCommand;
        })();
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

    setExpectedCommandArgsCount(command: CommandDefinition) {
        this.currentCommandExpectsArgs = command.args?.length ?? 0;
    }

    processOption(option: string): void {
        // for disabling further options processing
        if (option === '--') {
            this.optionsProcessingEnabled = false;
            this.commandSearchStopped = true;
            return;
        }
        // option arg
        let optionArg: string | undefined;
        const splitted = option.split('=');
        // should be implemented better
        if (splitted.length === 2) {
            optionArg = splitted[1];
            option = splitted[0];
        }
        // name
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
            if (thisOption.arg && thisOption.arg.required && !optionArg) {
                // if arg was not provided
                exitWithErrorInternal(
                    `Error: expected, but not provided argument for option "${option}"`,
                    this.treePath,
                );
            }
            if (!thisOption.arg && optionArg) {
                // if unexpected arg
                exitWithErrorInternal(
                    `Error: unexpected argument "${optionArg}" for option "${option}"`,
                    this.treePath,
                );
            }
            const parsedOption: ParsedOption = {
                option: thisOption,
                arg: optionArg,
            };
            this.options[thisOption.name] = parsedOption;
            this.commandSearchStopped = true;
            this.currentOption = parsedOption;
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

    async processCommand(arg: string) {
        assert(this.currentCommand.subcommands, `Subcommand "${arg}" does not exist`);
        this.currentCommand = await navigateSubcommands(this.currentCommand, arg);
        this.treePath.push(arg);
        this.setExpectedCommandArgsCount(this.currentCommand);
    }

    processArg(arg: string) {
        // if help or standalone option, ignore any errors
        if (this.standaloneOptionCalled) return;
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
                args[argName] = {
                    value: providedArg,
                    arg: arg,
                };
            }
        }
        this.processedArgsForCurrentCommand = args;
    }

    async parse(): Promise<void> {
        this.setExpectedCommandArgsCount(this.currentCommand);
        for (const arg of this.argv) {
            if (!this.optionsProcessingEnabled) {
                this.processArg(arg);
                continue;
            }
            if (isOption(arg)) {
                this.processOption(arg);
                continue;
            }
            if (!this.commandSearchStopped && arg in (this.currentCommand.subcommands ?? {})) {
                await this.processCommand(arg);
                continue;
            }
            // else
            this.processArg(arg);
        }
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
