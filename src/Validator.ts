import type { ValidatorFunc } from './types';
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
}
