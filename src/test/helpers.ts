import type { ValidatorFunc } from '../types';
import { ValidationError } from '../ValidationError';

export function expectValid(validate: ValidatorFunc, value: unknown, toBe?: unknown): void {
    const expected = toBe ?? value;
    const testCase = expect(validate(value, 'root'));

    if (typeof expected === 'object' && expected !== null) {
        testCase.toMatchObject(expected);
        return;
    }

    testCase.toBe(expected);
}

export function expectInvalid(validate: ValidatorFunc, value: unknown, message: string): void {
    expect(() => validate(value, 'root')).toThrow(new ValidationError(message));
}
