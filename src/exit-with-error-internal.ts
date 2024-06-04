import exitWithError from "./exit-with-error.js";
import { getHelpCommand } from "./help/help.js";
import type { ParsedCommand } from "./types/parsed";


export function exitWithErrorInternal(message: string, parsed: ParsedCommand): never {
    exitWithError(
        message
        + `\nUse "${getHelpCommand(parsed)}" to get help on this command`
    )
}