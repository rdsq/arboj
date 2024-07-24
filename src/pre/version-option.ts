import type { Option, ParsedStandaloneOption } from "../../types";

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
