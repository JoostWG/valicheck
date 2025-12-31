export type ValidatorFunc<T = unknown> = (value: unknown, path: string) => T;

export type ValidatorType<V extends ValidatorFunc> = V extends ValidatorFunc<infer T> ? T : never;
