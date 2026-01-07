import type {
    ObjectShape,
    ObjectValidatorFunc,
    ShapeType,
    ValidatorFunc,
    ValidatorType,
} from './types';
import { ValidationError } from './ValidationError';

export function string({ pattern }: { pattern?: RegExp } = {}): ValidatorFunc<string> {
    return (value, path) => {
        if (typeof value !== 'string') {
            throw new ValidationError(`[${path}] should be a string`);
        }

        if (pattern && !pattern.test(value)) {
            throw new ValidationError(`[${path}] doesn't match the pattern`);
        }

        return value;
    };
}

export function number(options: { allowNaN?: boolean } = {}): ValidatorFunc<number> {
    return (value, path) => {
        if (typeof value !== 'number' || !options.allowNaN && Number.isNaN(value)) {
            throw new ValidationError(`[${path}] should be a number`);
        }

        return value;
    };
}

export function boolean(
    options: { convertToTrue?: unknown[]; convertToFalse?: unknown[] } = {},
): ValidatorFunc<boolean> {
    return (value, path) => {
        if (typeof value === 'boolean') {
            return value;
        }

        if (options.convertToTrue?.includes(value)) {
            return true;
        }

        if (options.convertToFalse?.includes(value)) {
            return false;
        }

        throw new ValidationError(`[${path}] should be a boolean`);
    };
}

export function array<T>(validator: ValidatorFunc<T>): ValidatorFunc<T[]> {
    return (value, path) => {
        if (!Array.isArray(value)) {
            throw new ValidationError(`[${path}] should be an array`);
        }

        return value.map((item, index) => validator(item, `${path}[${index}]`));
    };
}

export function object<T extends Record<string, unknown>>(
    shape: ObjectShape<T>,
): ObjectValidatorFunc<T> {
    function validate(value: unknown, path: string): T {
        if (typeof value !== 'object' || !value || Array.isArray(value)) {
            throw new ValidationError(`[${path}] should be an object`);
        }

        const result: Record<string, unknown> = {};
        const errors: ValidationError[] = [];

        for (const [key, validator] of Object.entries(shape)) {
            try {
                result[key] = validator(
                    // @ts-expect-error Not something for now
                    value[key],
                    `${path}.${key}`,
                );
            } catch (error) {
                if (!(error instanceof ValidationError)) {
                    throw error;
                }

                errors.push(error);
            }
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.map((error) => error.message).join('\n'));
        }

        return result as T;
    }

    validate.shape = shape;

    return validate;
}

export function tuple<const T extends ValidatorFunc[]>(shape: T): ValidatorFunc<ShapeType<T>> {
    return (value, path): ShapeType<T> => {
        if (!Array.isArray(value)) {
            throw new ValidationError(`[${path}] should be an array`);
        }

        if (value.length !== shape.length) {
            throw new ValidationError(`[${path}] should have a length of ${shape.length}`);
        }

        return value.map((item, index) => shape[index](item, `${path}[${index}]`)) as ShapeType<
            T
        >;
    };
}

export function map<K, V>(
    keyValidator: ValidatorFunc<K>,
    valueValidator: ValidatorFunc<V>,
): ValidatorFunc<Map<K, V>> {
    return (value, path) => {
        const validator = array(tuple([keyValidator, valueValidator]));

        return new Map(validator(value, path));
    };
}

export function objectMap<K extends string, V>(
    keyValidator: ValidatorFunc<K>,
    valueValidator: ValidatorFunc<V>,
): ValidatorFunc<Map<K, V>> {
    return (value, path) => {
        if (typeof value !== 'object' || !value || Array.isArray(value)) {
            throw new ValidationError(`[${path}] should be an object`);
        }

        return new Map(
            Object.entries(value).map((
                [key, v],
            ) => [keyValidator(key, `keyof ${path}`), valueValidator(v, `${path}.${key}`)]),
        );
    };
}

export function literal<const T extends unknown[]>(...literals: T): ValidatorFunc<T[number]> {
    return (value, path) => {
        for (const x of literals) {
            if (x === value) {
                return value;
            }
        }

        throw new ValidationError(
            `[${path}] must be one of [${literals.toString()}], got ${JSON.stringify(value)}`,
        );
    };
}

export function anyOf<T extends ValidatorFunc>(validators: T[]): ValidatorFunc<ValidatorType<T>> {
    return (value, path) => {
        for (const validate of validators) {
            try {
                return validate(value, path) as ValidatorType<T>;
            } catch (error) {
                if (!(error instanceof ValidationError)) {
                    throw error;
                }
            }
        }

        throw new ValidationError(`[${path}] did not match any of the given validators`);
    };
}

export function intersect<T1 extends Record<string, unknown>, T2 extends Record<string, unknown>>(
    first: { shape: ObjectShape<T1> },
    second: { shape: ObjectShape<T2> },
): ObjectValidatorFunc<T1 & T2> {
    return object({ ...first.shape, ...second.shape } as ObjectShape<T1 & T2>);
}

export function enumValue<const T extends Record<string, string | number>>(
    enumClass: T,
): ValidatorFunc<Exclude<T[keyof T], keyof T>> {
    const values = Object.values(enumClass)
        .filter((value) => typeof value !== 'string' || !(value in enumClass));

    return literal(...values as Exclude<T[keyof T], keyof T>[]);
}

export function nullable<T>(validator: ValidatorFunc<T>): ValidatorFunc<T | null> {
    return (value, path) => {
        if (value === null) {
            return null;
        }

        return validator(value, path);
    };
}

export function optional<T>(validator: ValidatorFunc<T>): ValidatorFunc<T | undefined> {
    return (value, path) => {
        if (value === undefined) {
            return undefined;
        }

        return validator(value, path);
    };
}

export function unknown(): ValidatorFunc {
    return (value, path) => {
        if (value === undefined) {
            throw new ValidationError(`[${path}] cannot be undefined`);
        }

        return value;
    };
}
