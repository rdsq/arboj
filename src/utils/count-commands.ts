import { Command } from "../../types";

/**
 * Count command's subcommands including itself
 * @param command The command to start from
 * @returns The count including the command
 */
export default function countSubcommands(command: Command): number {
    let count = 1; // including this command
    for (const subcommand of Object.values(command.subcommands ?? {})) {
        count += countSubcommands(subcommand);
    }
    return count;
}
