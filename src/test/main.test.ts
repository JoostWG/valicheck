import { Validator } from '../Validator';
import { expectInvalid, expectValid } from './helpers';

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

describe('Object', () => {
    const validate = validator.object({
        foo: validator.optional(validator.string()),
        bar: validator.nullable(validator.number()),
    });

    test('Valid', () => {
        expectValid(validate, { foo: '', bar: 1 });
        expectValid(validate, { bar: 1 });
        expectValid(validate, { foo: '', bar: null });
        expectValid(validate, { bar: null });
    });

    test('Invalid', () => {
        expectInvalid(validate, { foo: '', bar: 'test' });
        expectInvalid(validate, { foo: '' });
        expectInvalid(validate, { foo: null, bar: null });
        expectInvalid(validate, 1);
        expectInvalid(validate, ['', null]);
    });
});

describe('Tuple', () => {
    const validate = validator.tuple([validator.string(), validator.literal(1, 2, 3)]);

    test('Valid', () => {
        expectValid(validate, ['test', 1]);
        expectValid(validate, ['', 2]);
    });

    test('Invalid', () => {
        expectInvalid(validate, [1, 'test']);
        expectInvalid(validate, ['test']);
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

describe('Enum', () => {
    const validateUsingObject = validator.enum({ test: 1, cool: 2 });

    test('Valid using object', () => {
        expectValid(validateUsingObject, 1);
        expectValid(validateUsingObject, 2);
    });

    test('Invalid using enum', () => {
        expectInvalid(validateUsingObject, 3);
        expectInvalid(validateUsingObject, 'test');
        expectInvalid(validateUsingObject, 'cool');
    });

    enum TestNumberEnum {
        Test = 1,
        Cool = 2,
    }

    const validateUsingNumberEnum = validator.enum(TestNumberEnum);

    test('Valid using number enum', () => {
        expectValid(validateUsingNumberEnum, 1);
        expectValid(validateUsingNumberEnum, 2);
    });

    test('Invalid using number enum', () => {
        expectInvalid(validateUsingNumberEnum, 3);
        expectInvalid(validateUsingNumberEnum, '1');
        expectInvalid(validateUsingNumberEnum, '2');
        expectInvalid(validateUsingNumberEnum, 'Test');
        expectInvalid(validateUsingNumberEnum, 'Cool');
    });

    enum TestStringEnum {
        Test = '1',
        Cool = '2',
    }

    const validateUsingStringEnum = validator.enum(TestStringEnum);

    test('Valid using number enum', () => {
        expectValid(validateUsingStringEnum, '1');
        expectValid(validateUsingStringEnum, '2');
    });

    test('Invalid using number enum', () => {
        expectInvalid(validateUsingStringEnum, 1);
        expectInvalid(validateUsingStringEnum, 2);
        expectInvalid(validateUsingStringEnum, 'Test');
        expectInvalid(validateUsingStringEnum, 'Cool');
    });
});

describe('Nullable', () => {
    const validate = validator.nullable(validator.string());

    test('Valid', () => {
        expectValid(validate, 'test');
        expectValid(validate, null);
    });

    test('Invalid', () => {
        expectInvalid(validate, undefined);
        expectInvalid(validate, 1);
    });
});

describe('Optional', () => {
    const validate = validator.optional(validator.string());

    test('Valid', () => {
        expectValid(validate, 'test');
        expectValid(validate, undefined);
    });

    test('Invalid', () => {
        expectInvalid(validate, null);
        expectInvalid(validate, 1);
    });
});

describe('Unknown', () => {
    const validate = validator.unknown();

    test('Valid', () => {
        expectValid(validate, 'test');
        expectValid(validate, 2);
        expectValid(validate, null);
        expectValid(validate, []);
    });

    test('Invalid', () => {
        expectInvalid(validate, undefined);
    });
});
