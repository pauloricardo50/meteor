import get from 'lodash/get';
import isArray from 'lodash/isArray';
import { flattenObjectTreeToArrays } from './general';

export const isEmptyFilterValue = filterValue =>
  !isArray(filterValue) || filterValue.length === 0;

const getNonEmptyFlattenedFilters = filters =>
  flattenObjectTreeToArrays(filters).filter(({ value }) => !isEmptyFilterValue(value));

// check an object matches all filters
const objectMatchesAllFilters = (object, filters) =>
  filters.every(({ path, value }) => {
    const valueOfObject = get(object, path);
    return value.includes(valueOfObject);
  });

export const filterArrayOfObjects = (filters, arrayOfObjects) => {
  // select only the filters have values in them
  const nonEmptyFilters = getNonEmptyFlattenedFilters(filters);
  return arrayOfObjects.filter(object =>
    objectMatchesAllFilters(object, nonEmptyFilters));
};
