// @flow
export const createRoute = (
  wildcardPath: string,
  replacers: { [string]: string } = {},
): string =>
  Object.keys(replacers).reduce(
    (path, replacer) => path.replace(replacer, replacers[replacer]),
    wildcardPath,
  );
