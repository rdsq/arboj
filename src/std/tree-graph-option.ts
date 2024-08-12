import type { Option, ParsedStandaloneOption } from '../../types.d.ts';
import { treeGraph } from '../util/tree-graph.ts';

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
    async standaloneHandler(event: ParsedStandaloneOption) {
        const graph = await treeGraph(
            event.parsedCommand.command,
            event.parsedCommand.treePath,
        );
        console.log(graph);
    },
};

export default treeGraphOption;
