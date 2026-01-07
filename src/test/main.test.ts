import { v } from '..';
import { expectInvalid, expectValid } from './helpers';

describe('String', () => {
    const validate = v.string();

    test('Valid', () => {
        expectValid(validate, 'sa');
    });

    test('Invalid', () => {
        expectInvalid(validate, 2, '[root] should be a string');
    });

    const validateWithPattern = v.string({ pattern: /^\d{4}$/u });

    test('Valid pattern', () => {
        expectValid(validateWithPattern, '1234');
    });

    test('Valid pattern', () => {
        expectInvalid(validateWithPattern, '12345', "[root] doesn't match the pattern");
    });
});

describe('Number', () => {
    const validate = v.number();

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

    const validateWithNaN = v.number({ allowNaN: true });

    test('Valid NaN', () => {
        expectValid(validateWithNaN, 1);
        expectValid(validateWithNaN, NaN);
    });
});

describe('Boolean', () => {
    const validate = v.boolean();

    test('Valid', () => {
        expectValid(validate, true);
        expectValid(validate, false);
    });

    test('Invalid', () => {
        expectInvalid(validate, 'true', '[root] should be a boolean');
        expectInvalid(validate, 0, '[root] should be a boolean');
    });

    const validateWithConvert = v.boolean({
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
    const validate = v.array(v.string());

    test('Valid', () => {
        expectValid(validate, ['a', 'b', 'c']);
        expectValid(validate, []);
    });

    test('Valid', () => {
        expectInvalid(validate, ['a', 'b', 3], '[root[2]] should be a string');
    });
});

describe('Object', () => {
    const validate = v.object({
        foo: v.optional(v.string()),
        bar: v.nullable(v.number()),
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
    const validate = v.tuple([v.string(), v.literal(1, 2, 3)]);

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
    const validate = v.map(v.literal('test'), v.literal(1, 2, 3));

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
    const validate = v.objectMap(v.literal('test'), v.literal(1, 2, 3));

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
    const validate = v.anyOf(v.string(), v.boolean());

    test('Valid', () => {
        expectValid(validate, 'sa');
        expectValid(validate, true);
    });

    test('Invalid', () => {
        expectInvalid(validate, 1, '[root] did not match any of the given validators');
        expectInvalid(validate, [], '[root] did not match any of the given validators');
    });
});

describe('Intersect', () => {
    const validate = v.intersect(
        v.object({ foo: v.number() }),
        v.object({ bar: v.string() }),
    );

    test('Valid', () => {
        expectValid(validate, { foo: 1, bar: '' });
    });

    test('Invalid', () => {
        expectInvalid(
            validate,
            {},
            [
                '[root.foo] should be a number',
                '[root.bar] should be a string',
            ].join('\n'),
        );
    });
});

describe('Literal', () => {
    const validate = v.literal('test', 1, 2);

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
    const validateUsingObject = v.enumValue({ test: 1, cool: 2 });

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

    const validateUsingNumberEnum = v.enumValue(TestNumberEnum);

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

    const validateUsingStringEnum = v.enumValue(TestStringEnum);

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
    const validate = v.nullable(v.string());

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
    const validate = v.optional(v.string());

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
    const validate = v.unknown();

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
