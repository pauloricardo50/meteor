import isArray from 'lodash/isArray';

export const arrayify = (value) => {
  if (value) {
    if (isArray(value)) {
      return value;
    }
    return [value];
  }

  return [];
};
