import exitWithError from "./exit-with-error.js";
import { getHelpCommand } from "./help/help.js";
import { ParsedCommand } from "./types/parsed.js";

export default function exitWithParserError(messages: string[], parsed: ParsedCommand): never {
    exitWithError(
        messages.join('\n')
        + `\nUse "${getHelpCommand(parsed)}" to get help on this command`
    )
}
