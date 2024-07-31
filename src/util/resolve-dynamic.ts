import { Command, CommandDefinition } from "../../types";

export async function resolveDynamic(command: Command): Promise<CommandDefinition> {
    if ('dynamicLoader' in command) {
        return await resolveDynamic(await command.dynamicLoader());
    } else {
        return command;
    }
}
