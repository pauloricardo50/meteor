import React from 'react';
import { withProps } from 'recompose';
import uniq from 'lodash/uniq';
import get from 'lodash/get';
import Select from 'react-select';

import T from '../../Translation';
import { isEmptyFilterValue } from '../../../utils/filterArrayOfObjects';

export const getFilterKeyFromPath = filterPath => filterPath.join('.');

const isUndefinedValue = value => typeof value === 'undefined';

// Translate the label when it should be translated
const getTranslationOfValueForPath = (value, filterKey) => {
  const translationId =
    (['type', 'status'].includes(filterKey) &&
      `TasksStatusDropdown.${value}`) ||
    (filterKey === 'roles' && `roles.${value}`);

  if (!translationId) {
    return null;
  }

  return <T id={translationId} />;
};

const getSelectOptionLabel = (value, filterPath) => {
  const filterKey = getFilterKeyFromPath(filterPath);

  if (isUndefinedValue(value)) {
    return <T id={`TableFilters.noneLabels.${filterKey}`} />;
  }

  return getTranslationOfValueForPath(value, filterKey) || `${value}`;
};

const getSelectOption = (value, filterPath) => ({
  label: getSelectOptionLabel(value, filterPath),
  value,
});

const getSelectOptions = (filterValue, filterPath) =>
  (isEmptyFilterValue(filterValue)
    ? []
    : filterValue.map(value => getSelectOption(value, filterPath)));

const undefinedValuesExist = values => values.some(isUndefinedValue);

const removeUndefinedValues = values =>
  values.filter(value => !isUndefinedValue(value));

const isAsyncSelect = value => value && value.constructor === Promise;

const createSelectOptionsForColumn = (filterPath, value) => {
  if (isAsyncSelect(value)) {
    return undefined;
  }

  let uniqueOptionValues = uniq(value);

  // in case undefined values are passed,
  // remove them and only put an undefined value at the end
  // so that a 'None' label will be put at the end
  if (undefinedValuesExist(uniqueOptionValues)) {
    uniqueOptionValues = [
      ...removeUndefinedValues(uniqueOptionValues),
      undefined,
    ];
  }

  return uniqueOptionValues.map(optionValue =>
    getSelectOption(optionValue, filterPath));
};

const makeAsyncOptionsLoader = (filterPath, promisedValue) => () =>
  promisedValue.then(value => ({
    options: createSelectOptionsForColumn(filterPath, value),
    complete: true,
  }));

export default withProps(({ onChange, filter: { path: filterPath, value: filterValue }, value }) => ({
  filterKey: getFilterKeyFromPath(filterPath),
  value: getSelectOptions(filterValue, filterPath),
  options: createSelectOptionsForColumn(filterPath, value),
  loadOptions: isAsyncSelect(value)
    ? makeAsyncOptionsLoader(filterPath, value)
    : undefined,
  onChange,
  SelectComponent: isAsyncSelect(value) ? Select.Async : Select,
}));
