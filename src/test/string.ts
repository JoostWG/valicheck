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
