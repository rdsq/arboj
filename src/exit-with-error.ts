/**
 * Exit with error status. as simple as `console.error(message); process.exit(1);`
 * @param message The error message
 */
export default function exitWithError(message: string): never {
    console.error(message);
    // @ts-ignore
    if (typeof Deno !== 'undefined') {
        // for deno
        // @ts-ignore
        return DelayNode.exit(1);
    } else {
        // for node
        // @ts-ignore
        return process.exit(1);
    }
}
