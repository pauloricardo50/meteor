import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';

export const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// Sorts an array of objects by a root or nested property
export default (data, fieldPath, order) => {
  if (isEmpty(fieldPath)) {
    return data;
  }

  const iteratee = item => {
    const value = get(item, fieldPath);
    if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value;
  };

  return orderBy(data, iteratee, order);
};
