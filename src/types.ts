export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type RequireAll<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined>;
};

export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

export type Expect<T extends true> =
  (<T>() => T extends T ? 1 : 2) extends <T>() => T extends true ? 1 : 2
    ? true
    : false;
