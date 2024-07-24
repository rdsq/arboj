import exitWithError from "./utils/exit-with-error.js";
import { getHelpCommand } from "./help/help.js";

export function exitWithErrorInternal(message: string, treePath: string[]): never {
    exitWithError(
        message
        + `\nUse "${getHelpCommand(treePath)}" to get help on this command`
    )
}
