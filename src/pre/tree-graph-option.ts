import type { Option } from "../../types";
import { treeGraph } from "../util/tree-graph";

/**
 * Same as `treeGraphCommand`, but as an option
 * @example
 * {
 *     globalOptions: [
 *         treeGraphOption,
 *     ],
 * }
 */
const treeGraphOption: Option = {
    name: 'tree',
    shortName: 't',
    description: 'Create a tree graph of a command',
    standaloneHandler(event) {
        const graph = treeGraph(
            event.parsedCommand.command,
            event.parsedCommand.treePath,
        );
        console.log(graph);
    },
};

export default treeGraphOption;
