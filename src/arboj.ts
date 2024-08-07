import { exitWithErrorInternal } from './util/exit-with-error-internal.ts';
import type { ArbojOptions, Command } from '../types.d.ts';
import { helpOption } from './std.ts';
import Parser from './parser-class.ts';
import getArgv from '@rdsq/cross-utils/argv';

/**
 * The ARBOJ API
 * @param options Options for the app
 */
export async function arboj(
    rootCommand: Command,
    cliName: string,
    options: ArbojOptions = {},
): Promise<void | never> {
    cliName ??= 'unnamed-cli';
    const globalOptions = options.globalOptions ?? [
        helpOption,
    ];
    const argv = options.argv ?? getArgv({ onlyArgs: true });
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
        const handler =
            parsedForStandalone.parsedOption.option.standaloneHandler;
        if (!handler) {
            throw new Error('Impossible error with standalone options');
        }
        // execute standalone option
        return handler(parsedForStandalone);
    } else {
        // if this command is not callable
        if (!parsed.command.handler) {
            exitWithErrorInternal(
                'Error: this command is not callable',
                parsed.treePath,
            );
        }
        // if everything is ok
        return parsed.command.handler(parsed);
    }
}
