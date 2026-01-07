import { v } from '.';
import type {
    ObjectShape,
    ObjectValidatorFunc,
    ShapeType,
    ValidatorFunc,
    ValidatorType,
} from './types';

/**
 * @deprecated
 */
export class Validator {
    /**
     * @deprecated
     */
    public string({ pattern }: { pattern?: RegExp } = {}): ValidatorFunc<string> {
        return v.string({ pattern });
    }

    public number(options?: { allowNaN: boolean }): ValidatorFunc<number> {
        return v.number(options);
    }

    /**
     * @deprecated
     */
    public boolean(
        options?: { convertToTrue?: unknown[]; convertToFalse?: unknown[] },
    ): ValidatorFunc<boolean> {
        return v.boolean(options);
    }

    /**
     * @deprecated
     */
    public array<T>(validator: ValidatorFunc<T>): ValidatorFunc<T[]> {
        return v.array(validator);
    }

    /**
     * @deprecated
     */
    public object<T extends Record<string, unknown>>(
        shape: ObjectShape<T>,
    ): ObjectValidatorFunc<T> {
        return v.object(shape);
    }

    /**
     * @deprecated
     */
    public tuple<const T extends ValidatorFunc[]>(shape: T): ValidatorFunc<ShapeType<T>> {
        return v.tuple(shape);
    }

    /**
     * @deprecated
     */
    public map<K, V>(
        keyValidator: ValidatorFunc<K>,
        valueValidator: ValidatorFunc<V>,
    ): ValidatorFunc<Map<K, V>> {
        return v.map(keyValidator, valueValidator);
    }

    /**
     * @deprecated
     */
    public objectMap<K extends string, V>(
        keyValidator: ValidatorFunc<K>,
        valueValidator: ValidatorFunc<V>,
    ): ValidatorFunc<Map<K, V>> {
        return v.objectMap(keyValidator, valueValidator);
    }

    /**
     * @deprecated
     */
    public literal<const T extends unknown[]>(...literals: T): ValidatorFunc<T[number]> {
        return v.literal(...literals);
    }

    /**
     * @deprecated
     */
    public anyOf<T extends ValidatorFunc>(validators: T[]): ValidatorFunc<ValidatorType<T>> {
        return v.anyOf(validators);
    }

    /**
     * @deprecated
     */
    public intersect<T1 extends Record<string, unknown>, T2 extends Record<string, unknown>>(
        first: { shape: ObjectShape<T1> },
        second: { shape: ObjectShape<T2> },
    ): ObjectValidatorFunc<T1 & T2> {
        return v.intersect(first, second);
    }

    /**
     * @deprecated
     */
    public enum<const T extends Record<string, string | number>>(
        enumClass: T,
    ): ValidatorFunc<Exclude<T[keyof T], keyof T>> {
        return v.enumValue(enumClass);
    }

    /**
     * @deprecated
     */
    public nullable<T>(validator: ValidatorFunc<T>): ValidatorFunc<T | null> {
        return v.nullable(validator);
    }

    /**
     * @deprecated
     */
    public optional<T>(validator: ValidatorFunc<T>): ValidatorFunc<T | undefined> {
        return v.optional(validator);
    }

    /**
     * @deprecated
     */
    public unknown(): ValidatorFunc {
        return v.unknown();
    }
}
