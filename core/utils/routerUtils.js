// @flow

const formatReplacerObject = replacers =>
  Object.keys(replacers).reduce(
    (obj, key) => ({
      ...obj,
      [key.startsWith(':') ? key : `:${key}`]: replacers[key],
    }),
    {},
  );

export const createRoute = (
  wildcardPath: string,
  replacers: { [string]: string } = {},
): string => {
  if (!replacers) {
    return wildcardPath;
  }

  const formattedReplacers = formatReplacerObject(replacers);

  return Object.keys(formattedReplacers).reduce(
    (path, replacer) => path.replace(replacer, formattedReplacers[replacer]),
    wildcardPath,
  );
};
