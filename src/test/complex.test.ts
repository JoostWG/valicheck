import { Validator } from '../Validator';
import { expectInvalid, expectValid } from './helpers';

const validator = new Validator();

describe('Complex 1', () => {
    const validate = validator.object({
        name: validator.string(),
        version: validator.optional(validator.string({ pattern: /^\d+\.\d+\.\d+$/u })),
        repository: validator.object({
            type: validator.literal('git'),
            url: validator.string(),
        }),
    });

    test('Valid', () => {
        expectValid(validate, {
            name: 'package-name',
            version: '1.2.3',
            repository: {
                type: 'git',
                url: 'whatever',
            },
        });

        expectValid(validate, {
            name: 'package-name',
            repository: {
                type: 'git',
                url: 'whatever',
            },
        });
    });

    test('Invalid', () => {
        expectInvalid(validate, {
            name: 'package-name',
            version: '1.2.e',
            repository: {
                type: 'git',
                url: 'whatever',
            },
        });

        expectInvalid(validate, {
            name: 'package-name',
            repository: {
                type: 'nope',
                url: 'whatever',
            },
        });
    });
});
