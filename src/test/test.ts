import type { ValidatorFunc } from '../types';
import { ValidationError } from '../ValidationError';
import { Validator } from '../Validator';

function expectValid(validate: ValidatorFunc, value: unknown, toBe?: unknown): void {
    const expected = toBe ?? value;
    const testCase = expect(validate(value, 'root'));

    if (typeof expected === 'object' && expected !== null) {
        testCase.toMatchObject(expected);
        return;
    }

    testCase.toBe(expected);
}

function expectInvalid(validate: ValidatorFunc, value: unknown): void {
    expect(() => validate(value, 'root')).toThrow(ValidationError);
}

const validator = new Validator();

describe('String', () => {
    const validate = validator.string();

    test('Valid', () => {
        expectValid(validate, '');
    });

    test('Invalid', () => {
        expectInvalid(validate, 2);
    });

    const validateWithPattern = validator.string({ pattern: /^\d{4}$/u });

    test('Valid pattern', () => {
        expectValid(validateWithPattern, '1234');
    });

    test('Valid pattern', () => {
        expectInvalid(validateWithPattern, '12345');
    });
});

describe('Number', () => {
    const validate = validator.number();

    test('Valid', () => {
        expectValid(validate, 1);
        expectValid(validate, 0);
        expectValid(validate, -1);
        expectValid(validate, 0.1);
    });

    test('Invalid', () => {
        expectInvalid(validate, true);
        expectInvalid(validate, 'test');
    });
});

describe('Boolean', () => {
    const validate = validator.boolean();

    test('Valid', () => {
        expectValid(validate, true);
        expectValid(validate, false);
    });

    test('Invalid', () => {
        expectInvalid(validate, 'true');
        expectInvalid(validate, 0);
    });

    const validateWithConvert = validator.boolean({
        convertToTrue: ['yes', 1],
        convertToFalse: ['no', 0],
    });

    test('Valid convert', () => {
        expectValid(validateWithConvert, true, true);
        expectValid(validateWithConvert, 'yes', true);
        expectValid(validateWithConvert, 1, true);

        expectValid(validateWithConvert, false, false);
        expectValid(validateWithConvert, 'no', false);
        expectValid(validateWithConvert, 0, false);
    });

    test('Invalid convert', () => {
        expectInvalid(validateWithConvert, 'true');
        expectInvalid(validateWithConvert, 'false');
        expectInvalid(validateWithConvert, 2);
        expectInvalid(validateWithConvert, []);
    });
});

describe('Array', () => {
    const validate = validator.array(validator.string());

    test('Valid', () => {
        expectValid(validate, ['a', 'b', 'c']);
        expectValid(validate, []);
    });

    test('Valid', () => {
        expectInvalid(validate, ['a', 'b', 3]);
    });
});

describe('Any of', () => {
    const validate = validator.anyOf([validator.string(), validator.boolean()]);

    test('Valid', () => {
        expectValid(validate, '');
        expectValid(validate, true);
    });

    test('Invalid', () => {
        expectInvalid(validate, 1);
        expectInvalid(validate, []);
    });
});

describe('Literal', () => {
    const validate = validator.literal('test', 1, 2);

    test('Valid', () => {
        expectValid(validate, 'test');
        expectValid(validate, 1);
        expectValid(validate, 2);
    });

    test('Invalid', () => {
        expectInvalid(validate, 3);
        expectInvalid(validate, []);
    });
});
