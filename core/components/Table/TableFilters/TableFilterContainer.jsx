import React from 'react';
import { withProps } from 'recompose';
import uniq from 'lodash/uniq';
import get from 'lodash/get';
import Select from 'react-select';

import T from '../../Translation';
import { isEmptyFilterValue } from '../../../utils/filterArrayOfObjects';

export const getFilterKeyFromPath = filterPath => filterPath.join('.');

const isUndefinedValue = value => !value && value !== false;

// Translate the label when it should be translated
const getTranslationOfValueForPath = (value, filterPath) => {
  const filterKey = getFilterKeyFromPath(filterPath);

  const translationId =
    (filterKey === 'type' && `TasksStatusDropdown.${value}`) ||
    (filterKey === 'roles' && `roles.${value}`);

  if (!translationId) {
    return null;
  }

  return <T id={translationId} />;
};

const getSelectOptionLabel = (value, filterPath) => {
  if (isUndefinedValue(value)) {
    return <T id="TableFilters.none" />;
  }

  return getTranslationOfValueForPath(value, filterPath) || value.toString();
};

const getSelectOption = (value, filterPath) => ({
  label: getSelectOptionLabel(value, filterPath),
  value,
});

const getSelectOptions = (filterValue, filterPath) =>
  (isEmptyFilterValue(filterValue)
    ? []
    : filterValue.map(value => getSelectOption(value, filterPath)));

const undefinedDataValuesExist = (data, filterPath) =>
  data.some((item) => {
    const itemValue = get(item, filterPath);
    // maybe we'll filter boolean values, so consider `false` a valid value
    return isUndefinedValue(itemValue);
  });

const removeUndefinedOptionValues = optionValues =>
  optionValues.filter(optionValue => !isUndefinedValue(optionValue));

const isAsyncSelect = value => value && value.constructor === Promise;

const createSelectOptionsForColumn = (filterPath, value = [], data = []) => {
  if (isAsyncSelect(value)) {
    return undefined;
  }

  let optionValues = removeUndefinedOptionValues(value);
  optionValues = uniq(optionValues);

  // in case there are data items with undefined fields for the given filter,
  // insert an undefined value so that a 'None' label will also be generated.
  // (See the `getSelectOptionLabel` method)
  if (undefinedDataValuesExist(data, filterPath)) {
    optionValues = [...optionValues, undefined];
  }

  return optionValues.map(optionValue =>
    getSelectOption(optionValue, filterPath));
};

const makeAsyncOptionsLoader = (filterPath, promisedValue, data) => () =>
  promisedValue.then(value => ({
    options: createSelectOptionsForColumn(filterPath, value, data),
    complete: true,
  }));

export default withProps(({
  onChange,
  filter: { path: filterPath, value: filterValue },
  data,
  value,
}) => ({
  filterKey: getFilterKeyFromPath(filterPath),
  value: getSelectOptions(filterValue, filterPath),
  options: createSelectOptionsForColumn(filterPath, value, data),
  loadOptions: isAsyncSelect(value)
    ? makeAsyncOptionsLoader(filterPath, value, data)
    : undefined,
  onChange,
  SelectComponent: isAsyncSelect(value) ? Select.Async : Select,
}));
