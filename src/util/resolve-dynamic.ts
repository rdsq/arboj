import { Command, CommandDefinition } from "../../types";

/**
 * Resolve dynamic command and return its definition
 * @param command The command that can be dynamic
 * @returns The command definition
 */
export async function resolveDynamic(command: Command): Promise<CommandDefinition> {
    if ('dynamicLoader' in command) {
        return await resolveDynamic(await command.dynamicLoader());
    } else {
        return command;
    }
}
