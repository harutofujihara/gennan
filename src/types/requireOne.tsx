export type RequireOne<T, K extends keyof T = keyof T> = K extends keyof T
  ? PartialRequire<T, K>
  : never;
type PartialRequire<O, K extends keyof O> = {
  [P in K]-?: O[P];
} &
  O;
