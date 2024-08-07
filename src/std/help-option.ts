import type { Option, ParsedStandaloneOption } from "../../types.d.ts";
import { renderHelp } from "../help/help.ts";

/**
 * The help option, that is being used in the global options
 * @example
 * {
 *     globalOptions: [
 *         helpOption,
 *     ],
 * }
 */
const helpOption: Option = {
    name: 'help',
    shortName: 'h',
    description: 'Get help',
    async standaloneHandler(event: ParsedStandaloneOption) {
        const parsedCommand = event.parsedCommand;
        // exclude help option
        delete parsedCommand.options.help;
        console.log(
            await renderHelp(parsedCommand)
        );
    },
};

export default helpOption;
