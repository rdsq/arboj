import { CommandDefinition, DynamicCommand } from "../../types";
import { resolveDynamic } from "./resolve-dynamic";

async function getSubcommand(command: CommandDefinition, subcommandName: string): Promise<CommandDefinition | never> {
    const subcommands = command.subcommands ?? {};
    let subcommand: CommandDefinition | DynamicCommand = await resolveDynamic(subcommands[subcommandName]);
    if (!subcommand) throw new Error(`Error: subcommand "${subcommandName}" does not exist on this command`);
    return subcommand;
}

export async function navigateSubcommands(command: CommandDefinition, ...path: string[]): Promise<CommandDefinition | never> {
    for (const subcommandName of path) {
        command = await getSubcommand(command, subcommandName);
    }
    return command;
}
