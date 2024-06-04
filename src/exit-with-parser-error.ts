import exitWithError from "./exit-with-error.js";
import { getHelpCommand } from "./help/help.js";
import { ParsedCommand } from "./types/parsed.js";

export default function exitWithParserError(message: string, parsed: ParsedCommand): never {
    exitWithError(
        message
        + `\nUse "${getHelpCommand(parsed)}" to get help on this command`
    )
}
