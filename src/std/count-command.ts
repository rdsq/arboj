import type { Command } from '../../../types.d.ts';
import { countSubcommands, navigateSubcommands } from '../util.ts';

// TODO: add docstring
const countSubcommandsCommand: Command = {
    description: 'Count subcommands of the CLI or an individual command',
    allowUnexpectedArgs: true,
    additionalUsage: '<tree-path...>',
    handler: async event => {
        const command = await navigateSubcommands(event.rootCommand, ...event.unexpectedArgs);
        const count = await countSubcommands(command);
        console.log(count);
    },
};

export default countSubcommandsCommand;
