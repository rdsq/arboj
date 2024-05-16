import type { Command } from "./types/command";

export type YaclilOptions = {
    /**
     * Yaclil treats the whole CLI as a recursive command
     * that has its subcommands, options, args.
     * This is that command
     */
    rootCommand: Command,
    /**
     * Enable or disable `--help` and `-h` options in the app.
     * `true` by default
     */
    helpOptions?: boolean,
};

export function yaclil(options: YaclilOptions) {
    options.helpOptions ||= true;
    /** The selected command, will be changed in the cycle */
    let selectedCommand: Command = options.rootCommand;
    let selectionStopped: boolean = false;
    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        // detect option (full name)
        if (arg.startsWith('-')) {
            selectionStopped = true;
            let optionName: string = arg.slice('--'.length);
            let searchBy: 'name' | 'shortName' = 'name';
            if (!arg.startsWith('--')) {
                optionName = arg.slice('-'.length);
                searchBy = 'shortName';
            }
            const selectedOption = (selectedCommand.options || []).find(
                (value) => value[searchBy] === optionName
            );
        }
    }
}
