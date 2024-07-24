import { exitWithErrorInternal } from "./exit-with-error-internal.js";
import type { YaclilOptions, Command } from "../types";
import { helpOption } from "./pre.js";
import Parser from "./parser-class.js";

function getArgv(customArgv?: string[]): string[] {
    if (customArgv) return customArgv;
    // @ts-ignore
    if (typeof Deno !== 'undefined') {
        // if deno
        // @ts-ignore
        return Deno.args;
    } else {
        // if node
        // @ts-ignore
        return process.argv.slice(2);
    }
}

/**
 * The YACLIL API
 * @param options Options for the app
 */
export function yaclil(rootCommand: Command, cliName: string, options: YaclilOptions = {}): void | never {
    cliName ??= 'unnamed-cli';
    const globalOptions = options.globalOptions ?? [
        helpOption,
    ];
    const argv = getArgv(options.argv);
    // call the parser
    const parser = new Parser({
        rootCommand,
        rootCommandName: cliName,
        initOptions: options,
        // remove the first two arguments
        argv: argv,
        globalOptions,
    });
    parser.parse();
    const parsed = parser.parsedObject;
    if (parser.standaloneOptionCalled) {
        // if standalone option called
        const parsedForStandalone = parser.parsedStandaloneOption;
        const handler = parsedForStandalone.parsedOption.option.standaloneHandler;
        if (!handler) throw new Error('Impossible error with standalone options');
        // execute standalone option
        handler(parsedForStandalone);
    } else {
        // if this command is not callable
        if (!parsed.command.handler) {
            exitWithErrorInternal(
                'Error: this command is not callable',
                parsed.treePath
            );
        }
        // if everything is ok
        parsed.command.handler(parsed);
    }
}
