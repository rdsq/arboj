import type { DynamicCommand } from '../../types.d.ts';

/**
 * Add file exports as dynamic commands
 * @example
 * const cmdFrom = new CommandFromModule(import.meta);
 * arboj({
 *      handler: null,
 *      subcommands: {
 *          sub: cmdFrom.module('./sub.ts')
 *      }
 * }, '...');
 */
export default class CommandFromModule {
    /**
     * Create the class
     * @param importMeta Literal `import.meta` of the file
     */
    constructor(private importMeta: ImportMeta) {}

    /**
     * Add a command from a file
     * @param path Relative or absolute path to the module
     * @param exportName Name of the file export to use as a command. Uses default export by default
     */
    module(path: string, exportName: string = 'default'): DynamicCommand {
        return {
            dynamicLoader: async () => {
                const modulePath = this.importMeta.resolve(path);
                const module = await import(modulePath);
                return module[exportName];
            },
        };
    }
}
