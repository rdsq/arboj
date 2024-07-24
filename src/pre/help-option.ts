import type { Option } from "../../types";
import { renderHelp } from "../help/help.js";

const helpOption: Option = {
    name: 'help',
    shortName: 'h',
    description: 'Get help',
    async standaloneHandler(event) {
        const parsedCommand = event.parsedCommand;
        // exclude help option
        delete parsedCommand.options.help;
        console.log(
            await renderHelp(parsedCommand)
        );
    },
};

export default helpOption;
