import get from 'lodash/get';
import isArray from 'lodash/isArray';
import { flattenObjectTreeToArrays } from './general';

export const isEmptyFilterValue = filterValue => !isArray(filterValue);

const getNonEmptyFlattenedFilters = filters =>
  flattenObjectTreeToArrays(filters).filter(({ value }) => !isEmptyFilterValue(value));

// check an object matches all filters
const objectMatchesAllFilters = (object, filters) =>
  filters.every(({ path, value }) => {
    const valueOfObject = get(object, path);
    return value.includes(valueOfObject);
  });

const filterArrayOfObjects = (filters, arrayOfObjects) => {
  // select only the filters have values in them
  const nonEmptyFilters = getNonEmptyFlattenedFilters(filters);
  return arrayOfObjects.filter(object =>
    objectMatchesAllFilters(object, nonEmptyFilters));
};

export default filterArrayOfObjects;
