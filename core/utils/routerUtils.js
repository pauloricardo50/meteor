// @flow
import queryString from 'query-string';

const formatReplacerObject = (replacers) =>
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
  searchParams = {},
): string => {
  if (!replacers) {
    return wildcardPath;
  }

  const formattedReplacers = formatReplacerObject(replacers);

  const url = Object.keys(formattedReplacers).reduce(
    (path, replacer) =>
      path
        .replace(`${replacer}?`, formattedReplacers[replacer])
        .replace(replacer, formattedReplacers[replacer]),
    wildcardPath,
  );

  if (Object.keys(searchParams).length) {
    return `${url}?${queryString.stringify(searchParams)}`;
  }

  return url;
};
