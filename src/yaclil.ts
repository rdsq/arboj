import { exitWithErrorInternal } from "./util/exit-with-error-internal.js";
import type { YaclilOptions, Command } from "../types.js";
import { helpOption } from "./std.js";
import Parser from "./parser-class.js";

function getArgv(customArgv?: string[]): string[] | never {
    if (customArgv) return customArgv;
    // @ts-ignore
    if (typeof Deno !== 'undefined' && 'args' in Deno) {
        // if deno
        // @ts-ignore
        return Deno.args;
        // @ts-ignore
    } else if (typeof process !== 'undefined' && 'argv' in process) {
        // if node
        // @ts-ignore
        return process.argv.slice(2);
        // @ts-ignore
    } else if (typeof Bun !== 'undefined' && 'argv' in Bun) {
        // if bun
        // @ts-ignore
        return Bun.args.slice(2);
    } else {
        throw new Error('Unknown runtime. Please pass the argv manually');
    }
}

/**
 * The YACLIL API
 * @param options Options for the app
 */
export async function yaclil(rootCommand: Command, cliName: string, options: YaclilOptions = {}): Promise<any | never> {
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
    await parser.waitForConstruct;
    await parser.parse();
    const parsed = parser.parsedObject;
    if (parser.standaloneOptionCalled) {
        // if standalone option called
        const parsedForStandalone = parser.parsedStandaloneOption;
        const handler = parsedForStandalone.parsedOption.option.standaloneHandler;
        if (!handler) throw new Error('Impossible error with standalone options');
        // execute standalone option
        return handler(parsedForStandalone);
    } else {
        // if this command is not callable
        if (!parsed.command.handler) {
            exitWithErrorInternal(
                'Error: this command is not callable',
                parsed.treePath
            );
        }
        // if everything is ok
        return parsed.command.handler(parsed);
    }
}
