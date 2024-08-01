/**
 * Exit with error status. as simple as `console.error(message); process.exit(1);`
 * @param message The error message
 */
export default function exitWithError(message: string): never {
    console.error(message);
    // @ts-ignore
    if (typeof Deno !== 'undefined' && 'exit' in Deno) {
        // for deno
        // @ts-ignore
        return Deno.exit(1);
        // @ts-ignore
    } else if (typeof process !== 'undefined' && 'exit' in process) {
        // for node
        // @ts-ignore
        return process.exit(1);
    } else {
        throw new Error('unknown runtime');
    }
}
