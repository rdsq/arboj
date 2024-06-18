import { Option, Command, Arg, YaclilOptions, ParsedCommand } from "./types.js";

export default class Parser {
    rootCommand: Command;
    initOptions: YaclilOptions;
    argv: string[];

    currentCommand: Command;
    commandSearchStopped: boolean;
    options: Option[];
    args: Arg[];
    unexpectedOptions: string[];
    unexpectedArgs: string[];
    currentOptionExpectsArgs: number;
    treePath: string[];

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
        this.options = [];
        this.args = [];
        this.unexpectedOptions = [];
        this.unexpectedArgs = [];
        this.currentOptionExpectsArgs = 0;
    }

    parse(): void {}

    get parsedObject(): ParsedCommand {
        return {
            rootCommand: this.rootCommand,
            command: this.currentCommand,
            treePath: this.treePath,
            unexpectedOptions: this.unexpectedOptions,
            unexpectedArgs: this.unexpectedArgs,
        }
    }
}
