import type {
    Command,
    CommandDefinition,
    DynamicCommand,
} from '../../types.d.ts';
import { resolveDynamic } from './resolve-dynamic.ts';

async function getSubcommand(
    command: CommandDefinition,
    subcommandName: string,
): Promise<CommandDefinition | never> {
    const subcommands = command.subcommands ?? {};
    const subcommand: CommandDefinition | DynamicCommand = await resolveDynamic(
        subcommands[subcommandName],
    );
    if (!subcommand) {
        throw new Error(
            `Error: subcommand "${subcommandName}" does not exist on this command`,
        );
    }
    return subcommand;
}

/**
 * Navigate command's subcommands
 * @param command The start command
 * @param path Path to navigate, like `['subcommand', 'another-subcommand']
 * @returns The target command
 */
export async function navigateSubcommands(
    command: Command,
    ...path: string[]
): Promise<CommandDefinition | never> {
    command = await resolveDynamic(command);
    for (const subcommandName of path) {
        command = await getSubcommand(command, subcommandName);
    }
    return command;
}
