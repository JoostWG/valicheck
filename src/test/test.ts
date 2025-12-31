/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ValidationError } from '../ValidationError';
import { Validator } from '../Validator';

const validator = new Validator();

describe('String', () => {
    const normal = validator.string();

    test('Valid', () => {
        expect(normal('', 'value')).toBe('');
    });

    test('Invalid', () => {
        expect(() => normal(2, 'value')).toThrow(ValidationError);
    });

    const pattern = validator.string({ pattern: /^\d{4}$/u });

    test('Valid pattern', () => {
        expect(pattern('1234', 'value')).toBe('1234');
    });

    test('Valid pattern', () => {
        expect(() => pattern('12345', 'value')).toThrow(ValidationError);
    });
});

describe('Boolean', () => {
    const normal = validator.boolean();

    test('Valid', () => {
        expect(normal(true, 'value')).toBe(true);
        expect(normal(false, 'value')).toBe(false);
    });

    test('Invalid', () => {
        expect(() => normal('true', 'value')).toThrow(ValidationError);
        expect(() => normal(0, 'value')).toThrow(ValidationError);
    });

    const withConvert = validator.boolean({ convertToTrue: ['yes', 1], convertToFalse: ['no', 0] });

    test('Valid convert', () => {
        expect(withConvert(true, 'value')).toBe(true);
        expect(withConvert('yes', 'value')).toBe(true);
        expect(withConvert(1, 'value')).toBe(true);

        expect(withConvert(false, 'value')).toBe(false);
        expect(withConvert('no', 'value')).toBe(false);
        expect(withConvert(0, 'value')).toBe(false);
    });

    test('Invalid convert', () => {
        expect(() => normal('true', 'value')).toThrow(ValidationError);
        expect(() => normal('false', 'value')).toThrow(ValidationError);
        expect(() => normal(2, 'value')).toThrow(ValidationError);
        expect(() => normal([], 'value')).toThrow(ValidationError);
    });
});
