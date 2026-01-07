import { v } from '..';
import { expectInvalid, expectValid } from './helpers';

describe('Complex 1', () => {
    const validate = v.object({
        name: v.string(),
        version: v.optional(v.string({ pattern: /^\d+\.\d+\.\d+$/u })),
        repository: v.object({
            type: v.literal('git'),
            url: v.string(),
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
        }, "[root.version] doesn't match the pattern");

        expectInvalid(
            validate,
            {
                name: [],
                version: {},
                repository: {
                    type: 'nope',
                    url: 23,
                },
            },
            [
                '[root.name] should be a string',
                '[root.version] should be a string',
                '[root.repository.type] must be one of [git], got "nope"',
                '[root.repository.url] should be a string',
            ].join('\n'),
        );
    });
});
