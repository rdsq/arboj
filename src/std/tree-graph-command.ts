import { treeGraph } from '../util/tree-graph.ts';
import type { Command, ParsedCommand } from '../../types.d.ts';
import { navigateSubcommands } from '../util.ts';

/**
 * Tree graph command, that prints a tree graph of the CLI
 * @example
 * {
 *     subcommands: {
 *         tree: treeGraphCommand,
 *     },
 * }
 */
const treeGraphCommand: Command = {
    description: 'Show a tree graph of the CLI',
    handler: async (event: ParsedCommand) => {
        const treePath = event.unexpectedArgs;
        const command: Command = await navigateSubcommands(
            event.rootCommand,
            ...treePath,
        );
        const colored = !event.options['no-color'];
        console.log(
            treeGraph(command, [event.appName, ...treePath], {
                colored: colored,
                showHidden: Boolean(event.options['show-commands']),
                showHiddenSubcommands: Boolean(
                    event.options['show-subcommands'],
                ),
                addTreePath: true,
            }),
        );
    },
    options: [
        {
            name: 'no-color',
            shortName: 'nc',
            description: 'Disable colored output',
        },
        {
            name: 'show-commands',
            shortName: 'c',
            description: 'Show hidden commands',
        },
        {
            name: 'show-subcommands',
            shortName: 's',
            description: 'Show hidden subcommands',
        },
    ],
    allowUnexpectedArgs: true,
    additionalUsage: '<tree-path...>',
};

export default treeGraphCommand;
