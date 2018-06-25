import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// TODO: should work with arrays also, not only Objects -> write tests for this case (sort primitives, arrays and objects, asc and desc = 6 tests; and maybe should not mutate input)
// Sorts an array of any contents: primitives, objects, arrays
export default (data, fieldPath, order = ORDER.ASC) => {
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

    if (order === ORDER.ASC) {
      return value1 > value2 ? 1 : -1;
    }

    if (order === ORDER.DESC) {
      return value1 < value2 ? 1 : -1;
    }

    return 0;
  });
};
