import type { OptionResult } from "./option";

/**
 * Options for handlers
 */
export type HandlerEvent = {
    /**
     * Options that were activated
     */
    options: OptionResult[],
    /**
     * Args that were added
     */
    args: string[],
};

/**
 * Handler function for commands
 */
export type Handler = (event: HandlerEvent) => void;
