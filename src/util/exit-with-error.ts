import exit from '@rdsq/cross-utils/exit';

/**
 * Exit with error status. as simple as `console.error(message); exit(1);`
 * @param message The error message
 */
export default function exitWithError(message: string): never {
    console.error(message);
    return exit(1);
}
