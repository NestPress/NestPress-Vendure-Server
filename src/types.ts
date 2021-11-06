declare type ConvertDeep<TYPE, TO> = TYPE extends string | number
  ? TO
  : TYPE extends Array<any>
  ? TYPE
  : TYPE extends Record<any, any>
  ? { [K in keyof TYPE]?: ConvertDeep<TYPE[K], TO> }
  : TO;

type Unpack<A> = A extends Array<infer E> ? E : A;

declare type ConvertDeepWithoutArray<TYPE, TO> = TYPE extends Array<any>
  ? number
  : TYPE extends string | number
  ? TO
  : TYPE extends Record<any, any>
  ? { [K in keyof TYPE]?: ConvertDeep<Unpack<TYPE[K]>, TO> }
  : TO;

declare type OmitByValueType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

declare type OnlyComplexProperties<T> = OmitByValueType<
  T,
  string | number | undefined | Date | Function
>;
