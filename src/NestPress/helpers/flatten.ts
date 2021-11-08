export const flatten = <T extends Record<string, any>>(
  object: T,
  path: string | null = null,
  separator = "."
): T =>
  Object.keys(object).reduce((acc: T, key: string): T => {
    const newPath = [path, key].filter(Boolean).join(separator);

    return Object.assign(
      acc,
      object?.[key] === "object"
        ? flatten(object[key], newPath, separator)
        : { [newPath]: object[key] }
    );
  }, {} as T);

export const flattenObject = (
  obj: Record<string, any>,
  prefix = "",
  stopFlatOnObjectValue?: (v: unknown) => boolean
): Record<string, any> =>
  Object.keys(obj).reduce((acc, k) => {
    const v = obj[k];
    const pre = prefix ? `${prefix}.${k}` : k;
    const canFlatNested =
      v && typeof v === "object" && !stopFlatOnObjectValue?.(v);

    if (canFlatNested)
      Object.assign(acc, flattenObject(v, pre, stopFlatOnObjectValue));
    // eslint-disable-next-line
    // @ts-ignore
    else acc[pre] = v;

    return acc;
  }, {});
