import exitWithError from './exit-with-error.ts';
import { getHelpCommand } from '../help/help.ts';

export function exitWithErrorInternal(
    message: string,
    treePath: string[],
): never {
    exitWithError(
        message +
            `\nUse "${getHelpCommand(treePath)}" to get help on this command`,
    );
}
