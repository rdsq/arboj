import Parser from "./parser-class.js";
import type { Command, ParsedCommand, YaclilOptions } from "../types.js";

export function parseCommand(options: {
    rootCommand: Command,
    rootCommandName: string,
    initOptions: YaclilOptions,
    argv: string[],
}): ParsedCommand {
    const parser = new Parser(options);
    parser.parse();
    const parsed = parser.parsedObject;
    return parsed;
}
