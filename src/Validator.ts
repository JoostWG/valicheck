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
}
