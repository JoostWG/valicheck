import type { ValidatorFunc } from '../types';
import { ValidationError } from '../ValidationError';

export function expectValid(validate: ValidatorFunc, value: unknown, expected?: unknown): void {
    expect(validate(value, 'root')).toEqual(expected ?? value);
}

export function expectInvalid(validate: ValidatorFunc, value: unknown, message: string): void {
    expect(() => validate(value, 'root')).toThrow(new ValidationError(message));
}
