import get from 'lodash/get';
import isArray from 'lodash/isArray';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';
import { flattenObjectTreeToArrays } from './general';

export const isEmptyFilterValue = filterValue =>
  !isArray(filterValue) || filterValue.length === 0;

const getNonEmptyFlattenedFilters = filters =>
  flattenObjectTreeToArrays(filters).filter(({ value }) => !isEmptyFilterValue(value));

// check an object matches all filters
const objectMatchesAllFilters = (object, filters) =>
  filters.every(({ path, value }) => {
    const valueOfObject = get(object, path);
    // since valueOfObject can be a primitive or an array,
    // we make sure it's always an array by flattening it
    // one level deep. E.g.: 'abc' => ['abc']; ['a', 'b'] => ['a', 'b']
    const arrayValueOfObject = flatten([valueOfObject]);

    return intersection(value, arrayValueOfObject).length > 0;
  });

const filterArrayOfObjects = (filters, arrayOfObjects) => {
  // select only the filters have values in them
  const nonEmptyFilters = getNonEmptyFlattenedFilters(filters);
  return arrayOfObjects.filter(object =>
    objectMatchesAllFilters(object, nonEmptyFilters));
};

export default filterArrayOfObjects;
