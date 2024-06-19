import type { Command } from "../types/command";

/**
 * Check if some command has subcommands
 * @param command The command to check
 * @returns Does it have subcommands or not
 */
export function hasSubcommands(command: Command): boolean | undefined {
    return command.subcommands && Object.keys(command.subcommands).length > 0;
}

/**
 * Render the command to `name <argsNum>`
 * @param command The command
 * @param includeArgs Include the args string like `<3>`
 * @returns The rendered string
 */
export function renderCommandName(command: Command, commandName: string): string {
    let name = commandName;
    if (command.args && command.args.length > 0) {
        // add args string
        name += ` <${command.args.length}>`
    }
    return name;
}

/**
 * Get the the biggest length of the command's subcommands' names
 * @param command The command to view
 * @returns The max length of this command's subcommands
 */
export function getMaxSubcommandsLength(command: Command): number {
    if (!hasSubcommands(command)) {
        // if this command has no subcommands
        return 0;
    }
    let maxLength = 0;
    for (let subcommandName of Object.keys(command.subcommands!)) {
        const subcommand = command.subcommands![subcommandName];
        const thisLength = renderCommandName(subcommand, subcommandName).length;
        if (thisLength > maxLength) {
            maxLength = thisLength;
        }
    }
    return maxLength;
}

/**
 * Render one subcommand for help
 * @param command The command
 * @param maxLength Max length of all commands
 * @returns The result string with command's name, args and description
 */
export function renderCommandString(command: Command, commandName: string, maxLength: number): string {
    let result = renderCommandName(command, commandName);
    if (command.description) {
        const freeSpaceCount = maxLength - result.length + 3;
        const freeSpace = ' '.repeat(freeSpaceCount);
        result += freeSpace + command.description;
    }
    return result;
}

/**
 * Render some command's subcommands
 * @param command The command to get subcommands from
 * @returns The rendered table
 */
export function renderCommandSubcommands(command: Command): string {
    const result: string[] = [];
    if (!hasSubcommands(command)) return '(no subcommands)';
    const maxLength = getMaxSubcommandsLength(command);
    for (let subcommandName of Object.keys(command.subcommands!)) {
        const subcommand = command.subcommands![subcommandName];
        // if it is hidden, ignore it
        if (subcommand.hidden ?? false) continue;
        result.push(renderCommandString(subcommand, subcommandName, maxLength));
    }
    return 'Subcommands:\n' + result.join('\n');
}
