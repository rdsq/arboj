import type { Command, CommandDefinition } from "../../types";
import { resolveDynamic } from "./resolve-dynamic";

export type CountSubcommandsOptions = {
    /** Should it count hidden commands? `true` by default */
    includeHidden?: boolean,
    /** Should it include hidden subcommands? `true` by default */
    includeHiddenSubcommands?: boolean,
};

/**
 * Count command's subcommands including itself
 * @param command The command to start from
 * @returns The count including the command
 */
export async function countSubcommands(command: Command, options: CountSubcommandsOptions): Promise<number> {
    let count = 1; // including this command
    const resolvedCommand: CommandDefinition = await resolveDynamic(command);
    for (const subcommandRaw of Object.values(resolvedCommand.subcommands ?? {})) {
        const subcommand: CommandDefinition = await resolveDynamic(subcommandRaw);
        if (
            (subcommand.hidden ?? false)
            && !(options.includeHidden ?? true)
        ) {
            // ignore such commands
            continue;
        } else if (
            (subcommand.hideSubcommands ?? false)
            && !(options.includeHiddenSubcommands ?? true)
        ) {
            // add only this command
            count += 1;
        } else {
            // add recursively
            count += await countSubcommands(subcommand, options);
        }
    }
    return count;
}
