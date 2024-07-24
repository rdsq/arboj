import { Command } from "../../types";

async function getSubcommand(command: Command, subcommandName: string): Promise<Command | never> {
    const subcommands = command.subcommands ?? {};
    const subcommand = subcommands[subcommandName];
    if (!subcommand) throw new Error(`Error: subcommand "${subcommandName}" does not exist on this command`);
    return subcommand;
}

export async function navigateSubcommands(command: Command, ...path: string[]): Promise<Command | never> {
    for (const subcommandName of path) {
        command = await getSubcommand(command, subcommandName);
    }
    return command;
}
