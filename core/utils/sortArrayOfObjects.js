import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// Sorts an array of objects by a root or nested property
export default (data, fieldPath, order) => {
  if (isEmpty(fieldPath)) {
    return data;
  }

  return orderBy(data, item => get(item, fieldPath), order);
};
