import exitWithError from '../exit-with-error.js';
import { treeGraph } from "../tree-graph.js";
import type { Command } from "../../types";

const treeGraphCommand: Command = {
    description: 'Show a tree graph of the CLI',
    handler: event => {
        const treePath = event.unexpectedArgs;
        let command: Command = event.rootCommand;
        let commandName: string = event.appName;
        if (treePath.length !== 0) {
            for (const element of treePath) {
                command = (command.subcommands ?? {})[element];
                if (!command) exitWithError(`Error: could not find subcommand "${element}" of command "${commandName}"`);
                commandName = element;
            }
        }
	    const colored = !Boolean(event.options['no-color']);
        console.log(
            treeGraph(command, [event.appName, ...treePath], {
                colored: colored,
                showHidden: Boolean(event.options['show-commands']),
                showHiddenSubcommands: Boolean(event.options["show-subcommands"]),
                addTreePath: true,
            }
        ));
    },
    options: [
        {
            name: 'no-color',
            shortName: 'nc',
            description: 'Disable colored output'
        },
        {
            name: 'show-commands',
            shortName: 'c',
            description: 'Show hidden commands'
        },
        {
            name: 'show-subcommands',
            shortName: 's',
            description: 'Show hidden subcommands'
        }
    ],
    allowUnexpectedArgs: true,
    additionalUsage: '<tree-path...>',
};

export default treeGraphCommand;
