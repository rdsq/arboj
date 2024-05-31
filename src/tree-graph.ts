import type { Command } from "./types/command";

const branchChar = '┗ ';
const straightChar = '┃ ';
const branchAndStraightChar = '┣ ';

/**
 * Generate graph recursively
 * @param command The command to get subcommands from
 * @param margin Count of `┃ ` repeats
 * @returns The graph of this command's subcommands
 */
function recursiveTree(command: Command, margin: number): string {
    const marginString = straightChar.repeat(margin);
    let result: string[] = [];
    const subcommandsLength = (command.subcommands?.length ?? 0);
    for (let i = 0; i < subcommandsLength; i++) {
        const subcommand = command.subcommands![i];
        // choose right char
        let char = branchAndStraightChar;
        if (i === subcommandsLength - 1) {
            char = branchChar;
        }
        // add it
        result.push(
            marginString + char + subcommand.name
        );
        // if it has subcommands
        if (subcommand.subcommands && subcommand.subcommands.length > 0) {
            result.push(recursiveTree(subcommand, margin + 1));
        }
    }
    return result.join("\n");
}

/**
 * Generate tree graph from any command
 * @param command The command to create graph from
 * @returns The graph
 */
export function treeGraph(command: Command): string {
    const graph = recursiveTree(command, 0);
    return command.name + '\n' + graph;
}
