import type { Option, ParsedStandaloneOption } from "../../types.d.ts";

/**
 * Add an option to show the version of your app
 * @example 
 * {
 *     options: [
 *         new VersionOption('1.0.0'),
 *     ]
 * }
 */
export class VersionOption implements Option {
    description = 'Show the version of this CLI';
    version: string;
    name = 'version';
    shortName = 'v';

    constructor(version: string) {
        this.version = version;
    }

    standaloneHandler(event: ParsedStandaloneOption) {
        console.log(this.version);
    }
}
