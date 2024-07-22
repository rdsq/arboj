import type { Command } from "../types";

const branchChar = '┗ ';
const straightChar = '┃ ';
const branchAndStraightChar = '┣ ';

/**
 * Create something like `cli-name/command/another/`
 * @param treePath The path to the command, including app name
 * @param colored Should it be colored
 * @returns Thing like `cli-name/command/another/`
 */
function renderTreePath(treePath: string[], colored: boolean): string {
    treePath.pop(); // remove the last element  because it will be added by the command
    if (treePath.length === 0) {
	    return '';
    }
    return (colored ? '\x1b[2m' : '') // dimmed
    + treePath.join('/') + '/'
    + (colored ? '\x1b[0m' : ''); // reset
}

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
    const subcommandsKeys = Object.keys(command.subcommands ?? {});
    const subcommandsLength: number = subcommandsKeys.length;
    if (command.subcommands) {
        for (let i = 0; i < subcommandsLength; i++) {
            const subcommandName = subcommandsKeys[i];
            const subcommand = command.subcommands[subcommandName];
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
            let commandName = subcommandName;
            if (options.colored && subcommand.handler === null) {
                // dim it if it does not have a handler and coloring is enabled
                commandName = `\x1b[2m${commandName}\x1b[0m`;
            }
            // add it
            result.push(
                marginString + char + commandName
            );
            // if it has subcommands
            if (subcommand.subcommands && Object.keys(subcommand.subcommands).length > 0) {
                // if subcommands are hidden and showing them is not configured
                if ((subcommand.hideSubcommands ?? false) && !options.showHiddenSubcommands) {
                    // sign that it has hidden subcommands
		            const sign = options.colored ? ' \x1b[34m+\x1b[0m' : ' +';
                    result[result.length - 1] += sign;
                } else {
                    result.push(recursiveTree(subcommand, margin + 1, options, endedMargin));
                }
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
    /** Add something like `cli-name/command/another/` */
    addTreePath?: boolean,
};

/**
 * Generate tree graph from any command
 * @param command The command to create graph from
 * @options Options for the tree graph generator. Boolean values are legacy, they represent the color
 * @returns The graph
 */
export function treeGraph(command: Command, commandNameOrTreePath: string | string[], options: TreeGraphOptions = {}): string {
    // legacy
    if (typeof options === 'boolean') options = { colored: options };
    // default values
    options.colored ??= false;
    options.showHidden ??= false;
    options.showHiddenSubcommands ??= false;
    options.addTreePath ??= true;
    // tree path variables
    let commandName: string;
    let treePath: string[];
    if (typeof commandNameOrTreePath === "string") {
        commandName = commandNameOrTreePath;
        treePath = [ commandNameOrTreePath ];
    } else {
        commandName = commandNameOrTreePath[commandNameOrTreePath.length - 1];
        treePath = commandNameOrTreePath;
    }
    // tree path render
    let treePathRender: string;
    if (options.addTreePath) {
        treePathRender = renderTreePath(treePath, options.colored);
    } else {
        treePathRender = '';
    }
    // run
    const graph = recursiveTree(command, 0, options, 0);
    const emptyMessage = options.colored ? '\x1b[34m(empty)\x1b[0m' : '(empty)';
    return treePathRender + commandName + '\n' + (graph || emptyMessage);
}
