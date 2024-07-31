import type { ParsedArg } from "../../types";
import exitWithError from "./exit-with-error";

export type PossibleArgTypes = {
    'string': string,
    'int': number,
    'float': number,
    'boolean': boolean,
};

export type ConfidentReturnType<T extends keyof PossibleArgTypes, A extends ParsedArg> = (
    A['arg']['required'] extends true
    ? PossibleArgTypes[T]
    : PossibleArgTypes[T] | undefined
)

export type ResultType<T extends keyof PossibleArgTypes, A extends ParsedArg | undefined> = (
    A extends ParsedArg
    ? ConfidentReturnType<T, A>
    : undefined
);

export function argAsType<T extends keyof PossibleArgTypes, A extends ParsedArg | undefined>(arg: A, argType: T): ResultType<T, A> {
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
