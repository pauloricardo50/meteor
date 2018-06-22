import isArray from 'lodash/isArray';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export const arrayify = (value) => {
  if (value) {
    if (isArray(value)) {
      return value;
    }
    return [value];
  }

  return [];
};

export const sortArray = (data, fieldPath, order = 'asc') => {
  if (isEmpty(fieldPath)) {
    return data;
  }

  return data.slice(0).sort((a, b) => {
    let value1 = a;
    let value2 = b;

    if (a && a.constructor === Object) {
      value1 = get(a, fieldPath);
    }

    if (b && b.constructor === Object) {
      value2 = get(b, fieldPath);
    }

    if (order === 'asc') {
      return value1 > value2 ? 1 : -1;
    }

    if (order === 'desc') {
      return value1 < value2 ? 1 : -1;
    }

    return 0;
  });
};
