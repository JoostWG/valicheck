import type { ShapeType, ValidatorFunc, ValidatorType } from './types';
import { ValidationError } from './ValidationError';

export class Validator {
    public string({ pattern }: { pattern?: RegExp } = {}): ValidatorFunc<string> {
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

    public number(): ValidatorFunc<number> {
        return (value, path) => {
            if (typeof value !== 'number') {
                throw new ValidationError(`[${path}] should be a number`);
            }

            return value;
        };
    }

    public boolean(
        options?: { convertToTrue?: unknown[]; convertToFalse?: unknown[] },
    ): ValidatorFunc<boolean> {
        return (value, path) => {
            if (typeof value === 'boolean') {
                return value;
            }

            if (options?.convertToTrue?.includes(value)) {
                return true;
            }

            if (options?.convertToFalse?.includes(value)) {
                return false;
            }

            throw new ValidationError(`[${path}] should be a boolean`);
        };
    }

    public array<T>(validator: ValidatorFunc<T>): ValidatorFunc<T[]> {
        return (value, path) => {
            if (!Array.isArray(value)) {
                throw new ValidationError(`[${path}] should be an array`);
            }

            return value.map((item, index) => validator(item, `${path}[${index}]`));
        };
    }

    public tuple<const T extends ValidatorFunc[]>(shape: T): ValidatorFunc<ShapeType<T>> {
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

    public literal<const T extends unknown[]>(...literals: T): ValidatorFunc<T[number]> {
        return (value, path) => {
            for (const x of literals) {
                if (x === value) {
                    return value;
                }
            }

            throw new ValidationError(`[${path}] is not exact match`);
        };
    }

    public anyOf<T extends ValidatorFunc>(validators: T[]): ValidatorFunc<ValidatorType<T>> {
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

            throw new ValidationError(`[${path}] did not match any of the given be a boolean`);
        };
    }

    public nullable<T>(validator: ValidatorFunc<T>): ValidatorFunc<T | null> {
        return (value, path) => {
            if (value === null) {
                return null;
            }

            return validator(value, path);
        };
    }

    public optional<T>(validator: ValidatorFunc<T>): ValidatorFunc<T | undefined> {
        return (value, path) => {
            if (value === undefined) {
                return undefined;
            }

            return validator(value, path);
        };
    }

    public unknown(): ValidatorFunc {
        return (value, path) => {
            if (value === undefined) {
                throw new ValidationError(`[${path}] cannot be undefined`);
            }

            return value;
        };
    }
}
