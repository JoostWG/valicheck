import { ValidatorFunc, ObjectShape, ShapeType, ValidatorType } from './types.d.js';

declare class Validator {
    string({ pattern }?: {
        pattern?: RegExp;
    }): ValidatorFunc<string>;
    number(options?: {
        allowNaN: boolean;
    }): ValidatorFunc<number>;
    boolean(options?: {
        convertToTrue?: unknown[];
        convertToFalse?: unknown[];
    }): ValidatorFunc<boolean>;
    array<T>(validator: ValidatorFunc<T>): ValidatorFunc<T[]>;
    object<T extends Record<string, unknown>>(shape: ObjectShape<T>): ValidatorFunc<T>;
    tuple<const T extends ValidatorFunc[]>(shape: T): ValidatorFunc<ShapeType<T>>;
    literal<const T extends unknown[]>(...literals: T): ValidatorFunc<T[number]>;
    anyOf<T extends ValidatorFunc>(validators: T[]): ValidatorFunc<ValidatorType<T>>;
    enum<const T extends Record<string, string | number>>(enumClass: T): ValidatorFunc<Exclude<T[keyof T], keyof T>>;
    nullable<T>(validator: ValidatorFunc<T>): ValidatorFunc<T | null>;
    optional<T>(validator: ValidatorFunc<T>): ValidatorFunc<T | undefined>;
    unknown(): ValidatorFunc;
}

export { Validator };
