import type { ParsedArg } from "../../types.d.ts";
import exitWithError from "./exit-with-error.ts";

export type PossibleArgTypes = {
    'string': string,
    'int': number,
    'float': number,
    'boolean': boolean,
};

/**
 * Parse argument as some type
 * @param arg The argument, like `event.args.example`
 * @param argType Parse this argument as
 * @returns Parsed value of this argument
 */
export function argAsType(arg: ParsedArg | undefined, argType: keyof PossibleArgTypes): any {
    if (arg === undefined) {
        return undefined;
    }
    function error(typeName: string): never {
        return exitWithError(`Error: invalid value "${arg!.value}" for argument "${arg!.arg.name}" of type "${typeName}"`);
    }
    let result: PossibleArgTypes[keyof PossibleArgTypes];
    switch (argType) {
        case 'int':
            result = parseInt(arg.value);
            if (Number.isNaN(result)) {
                error('int number');
            }
            break;
        case 'float':
            result = parseFloat(arg.value);
            if (Number.isNaN(result)) {
                error('float number');
            }
        case 'string':
            result = arg.value;
        case 'boolean':
            if (arg.value === 'true') {
                result = true;
            } else if (arg.value === 'false') {
                result = false;
            } else {
                error('boolean');
            }
        default:
            throw new TypeError('unknown arg type');
    }
    return result;
}
