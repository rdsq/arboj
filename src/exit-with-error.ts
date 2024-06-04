/**
 * Exit with error status
 * @param message The error message
 */
export default function exitWithError(message: string): never {
    console.error(message);
    process.exit(1);
}
