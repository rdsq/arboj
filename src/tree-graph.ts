import type { Command } from "./types/command";

const branchChar = '┗ ';
const straightChar = '┃ ';
const branchAndStraightChar = '┣ ';

/**
 * Generate graph recursively
 * @param command The command to get subcommands from
 * @param margin Count of `┃ ` repeats
 * @param endedMargin Count of margin levels on start that are ended
 * @returns The graph of this command's subcommands
 */
function recursiveTree(command: Command, margin: number, options: TreeGraphOptions, endedMargin: number): string {
    const marginString = '  '.repeat(endedMargin) + straightChar.repeat(margin - endedMargin);
    let result: string[] = [];
    const subcommandsLength = (command.subcommands?.length ?? 0);
    for (let i = 0; i < subcommandsLength; i++) {
        const subcommand = command.subcommands![i];
        // if it is hidden and showing them is not configured, move to the next one
        if ((subcommand.hidden ?? false) && !options.showHidden) continue;
        // choose right char
        let char = branchAndStraightChar;
        if (i === subcommandsLength - 1) {
            char = branchChar;
            // increase ended margin count
            endedMargin++;
        }
        // get command name
        let commandName = subcommand.name;
        if (options.colored && subcommand.handler === null) {
            // dim it if it does not have a handler and coloring is enabled
            commandName = `\x1b[2m${commandName}\x1b[0m`;
        }
        // add it
        result.push(
            marginString + char + commandName
        );
        // if it has subcommands
        if (subcommand.subcommands && subcommand.subcommands.length > 0) {
            // if subcommands are hidden and showing them is not configured
            if ((subcommand.hideSubcommands ?? false) && !options.showHiddenSubcommands) {
                // sign that it has hidden subcommands
                result[result.length - 1] += ' +';
            } else {
                result.push(recursiveTree(subcommand, margin + 1, options, endedMargin));
            }
        }
    }
    return result.join("\n");
}

export type TreeGraphOptions = {
    /** Should it dim commands without handlers for terminal */
    colored?: boolean,
    /** Show hidden commands */
    showHidden?: boolean,
    /** Show hidden subcommands of commands instead of hiding them under ` +` */
    showHiddenSubcommands?: boolean,
};

/**
 * Generate tree graph from any command
 * @param command The command to create graph from
 * @options Options for the tree graph generator. Boolean values are legacy, they represent the color
 * @returns The graph
 */
export function treeGraph(command: Command, options: TreeGraphOptions = {}): string {
    // legacy
    if (typeof options === 'boolean') options = { colored: options };
    // default values
    options.colored ??= false;
    options.showHidden ??= false;
    options.showHiddenSubcommands ??= false;
    // run
    const graph = recursiveTree(command, 0, options, 0);
    return command.name + '\n' + graph;
}
