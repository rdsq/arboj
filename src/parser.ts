import Parser from "./parser-class.js";
import type { Command, Option, YaclilOptions } from "../types.js";

export function parseCommand(options: {
    rootCommand: Command,
    rootCommandName: string,
    initOptions: YaclilOptions,
    argv: string[],
    globalOptions: Option[],
}) {
    const parser = new Parser(options);
    parser.parse();
    return parser;
}
