type ValidatorFunc<T = unknown> = (value: unknown, path: string) => T;

type ValidatorType<V extends ValidatorFunc> = V extends ValidatorFunc<infer T> ? T : never;

type ObjectShape<T extends Record<string, unknown>> = {
    [K in keyof T]: ValidatorFunc<T[K]>;
};

type ShapeType<T extends ValidatorFunc[]> = { [K in keyof T]: ValidatorType<T[K]> };

export type { ObjectShape, ShapeType, ValidatorFunc, ValidatorType };
