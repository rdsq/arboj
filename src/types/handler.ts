import type { ParsedCommand } from "./parsed";

/**
 * Handler function for commands
 */
export type Handler = (event: ParsedCommand) => void;
