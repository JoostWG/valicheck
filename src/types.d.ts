export type ValidatorFunc<T = unknown> = (value: unknown, path: string) => T;

export type ValidatorType<V extends ValidatorFunc> = V extends ValidatorFunc<infer T> ? T : never;

export type ObjectShape<T extends Record<string, unknown>> = {
    [K in keyof T]: ValidatorFunc<T[K]>;
};

export type ShapeType<T extends ValidatorFunc[]> = { [K in keyof T]: ValidatorType<T[K]> };

export type ObjectValidatorFunc<T extends Record<string, unknown>> = ValidatorFunc<T> & {
    shape: ObjectShape<T>;
};
