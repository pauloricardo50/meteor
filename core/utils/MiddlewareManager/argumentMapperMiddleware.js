// @flow
import isArray from 'lodash/isArray';

export const makeArgumentMapper = (mappings: { [key: string]: Function }) => Object.keys(mappings).reduce(
  (mapper, key) => ({
    ...mapper,
    [key]: () => next => (...args) => {
      const argumentMapperFunc = mappings[key];
      const newArgumentStructure = argumentMapperFunc(...args);

      if (isArray(newArgumentStructure)) {
        return next(...newArgumentStructure);
      }

      return next(newArgumentStructure);
    },
  }),
  {},
);

export default makeArgumentMapper;
