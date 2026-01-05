import { Validator } from '../Validator';
import { expectInvalid, expectValid } from './helpers';

const validator = new Validator();

describe('String', () => {
    const validate = validator.string();

    test('Valid', () => {
        expectValid(validate, 'sa');
    });

    test('Invalid', () => {
        expectInvalid(validate, 2, '[root] should be a string');
    });

    const validateWithPattern = validator.string({ pattern: /^\d{4}$/u });

    test('Valid pattern', () => {
        expectValid(validateWithPattern, '1234');
    });

    test('Valid pattern', () => {
        expectInvalid(validateWithPattern, '12345', "[root] doesn't match the pattern");
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
        expectInvalid(validate, true, '[root] should be a number');
        expectInvalid(validate, NaN, '[root] should be a number');
        expectInvalid(validate, 'test', '[root] should be a number');
    });

    const validateWithNaN = validator.number({ allowNaN: true });

    test('Valid NaN', () => {
        expectValid(validateWithNaN, 1);
        expectValid(validateWithNaN, NaN);
    });
});

describe('Boolean', () => {
    const validate = validator.boolean();

    test('Valid', () => {
        expectValid(validate, true);
        expectValid(validate, false);
    });

    test('Invalid', () => {
        expectInvalid(validate, 'true', '[root] should be a boolean');
        expectInvalid(validate, 0, '[root] should be a boolean');
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
        expectInvalid(validateWithConvert, 'true', '[root] should be a boolean');
        expectInvalid(validateWithConvert, 'false', '[root] should be a boolean');
        expectInvalid(validateWithConvert, 2, '[root] should be a boolean');
        expectInvalid(validateWithConvert, [], '[root] should be a boolean');
    });
});

describe('Array', () => {
    const validate = validator.array(validator.string());

    test('Valid', () => {
        expectValid(validate, ['a', 'b', 'c']);
        expectValid(validate, []);
    });

    test('Valid', () => {
        expectInvalid(validate, ['a', 'b', 3], '[root[2]] should be a string');
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
        expectInvalid(validate, { foo: '', bar: 'test' }, '[root.bar] should be a number');
        expectInvalid(validate, { foo: '' }, '[root.bar] should be a number');
        expectInvalid(validate, { foo: null, bar: null }, '[root.foo] should be a string');
        expectInvalid(validate, 1, '[root] should be an object');
        expectInvalid(validate, ['', null], '[root] should be an object');
    });
});

describe('Tuple', () => {
    const validate = validator.tuple([validator.string(), validator.literal(1, 2, 3)]);

    test('Valid', () => {
        expectValid(validate, ['test', 1]);
        expectValid(validate, ['', 2]);
    });

    test('Invalid', () => {
        expectInvalid(validate, [1, 'test'], '[root[0]] should be a string');
        expectInvalid(validate, ['test'], '[root] should have a length of 2');
    });
});

describe('Map', () => {
    const validate = validator.map(validator.literal('test'), validator.literal(1, 2, 3));

    test('Valid', () => {
        expectValid(validate, [['test', 1]], new Map([['test', 1]]));
        expectValid(validate, [['test', 1], ['test', 2]], new Map([['test', 1], ['test', 2]]));
    });

    test('Invalid', () => {
        expectInvalid(validate, { test: 1 }, '[root] should be an array');
        expectInvalid(validate, [['test', 4]], '[root[0][1]] must be one of [1,2,3], got 4');
        expectInvalid(validate, [[[], 3]], '[root[0][0]] must be one of [test], got []');
    });
});

describe('Object map', () => {
    const validate = validator.objectMap(validator.literal('test'), validator.literal(1, 2, 3));

    test('Valid', () => {
        expectValid(validate, { test: 1 }, new Map([['test', 1]]));
    });

    test('Invalid', () => {
        expectInvalid(validate, { test: 4 }, '[root.test] must be one of [1,2,3], got 4');
        expectInvalid(validate, { nope: 4 }, '[keyof root] must be one of [test], got "nope"');
        expectInvalid(validate, [['test', 4]], '[root] should be an object');
        expectInvalid(validate, [[[], 3]], '[root] should be an object');
    });
});

describe('Any of', () => {
    const validate = validator.anyOf([validator.string(), validator.boolean()]);

    test('Valid', () => {
        expectValid(validate, 'sa');
        expectValid(validate, true);
    });

    test('Invalid', () => {
        expectInvalid(validate, 1, '[root] did not match any of the given validators');
        expectInvalid(validate, [], '[root] did not match any of the given validators');
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
        expectInvalid(validate, 3, '[root] must be one of [test,1,2], got 3');
        expectInvalid(validate, [], '[root] must be one of [test,1,2], got []');
    });
});

describe('Enum', () => {
    const validateUsingObject = validator.enum({ test: 1, cool: 2 });

    test('Valid using object', () => {
        expectValid(validateUsingObject, 1);
        expectValid(validateUsingObject, 2);
    });

    test('Invalid using enum', () => {
        expectInvalid(validateUsingObject, 3, '[root] must be one of [1,2], got 3');
        expectInvalid(validateUsingObject, 'test', '[root] must be one of [1,2], got "test"');
        expectInvalid(validateUsingObject, 'cool', '[root] must be one of [1,2], got "cool"');
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
        expectInvalid(validateUsingNumberEnum, 3, '[root] must be one of [1,2], got 3');
        expectInvalid(validateUsingNumberEnum, '1', '[root] must be one of [1,2], got "1"');
        expectInvalid(validateUsingNumberEnum, '2', '[root] must be one of [1,2], got "2"');
        expectInvalid(validateUsingNumberEnum, 'Test', '[root] must be one of [1,2], got "Test"');
        expectInvalid(validateUsingNumberEnum, 'Cool', '[root] must be one of [1,2], got "Cool"');
    });

    enum TestStringEnum {
        Test = '1',
        Cool = '2',
    }

    const validateUsingStringEnum = validator.enum(TestStringEnum);

    test('Valid using string enum', () => {
        expectValid(validateUsingStringEnum, '1');
        expectValid(validateUsingStringEnum, '2');
    });

    test('Invalid using string enum', () => {
        expectInvalid(validateUsingStringEnum, 1, '[root] must be one of [1,2], got 1');
        expectInvalid(validateUsingStringEnum, 2, '[root] must be one of [1,2], got 2');
        expectInvalid(validateUsingStringEnum, 'Test', '[root] must be one of [1,2], got "Test"');
        expectInvalid(validateUsingStringEnum, 'Cool', '[root] must be one of [1,2], got "Cool"');
    });
});

describe('Nullable', () => {
    const validate = validator.nullable(validator.string());

    test('Valid', () => {
        expectValid(validate, 'test');
        expectValid(validate, null);
    });

    test('Invalid', () => {
        expectInvalid(validate, undefined, '[root] should be a string');
        expectInvalid(validate, 1, '[root] should be a string');
    });
});

describe('Optional', () => {
    const validate = validator.optional(validator.string());

    test('Valid', () => {
        expectValid(validate, 'test');
        expectValid(validate, undefined);
    });

    test('Invalid', () => {
        expectInvalid(validate, null, '[root] should be a string');
        expectInvalid(validate, 1, '[root] should be a string');
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
        expectInvalid(validate, undefined, '[root] cannot be undefined');
    });
});
