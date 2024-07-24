import type { Command } from "../../types";

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
export default function countSubcommands(command: Command, options: CountSubcommandsOptions): number {
    let count = 1; // including this command
    for (const subcommand of Object.values(command.subcommands ?? {})) {
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
            count += countSubcommands(subcommand, options);
        }
    }
    return count;
}
