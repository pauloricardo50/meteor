// NOTE: A great way to refactor this would be to use only async options
// by Promistifying the `value` and thus be able to use only
// `loadOptions` prop & Select.Async and remove `options` and Select component
// However, many tests are based on the `options` prop, so they should be refactored
import React from 'react';
import { withProps } from 'recompose';
import uniq from 'lodash/uniq';
import Select from 'react-select';

import formatMessage from '../../../utils/intl';
import T from '../../Translation';
import { isEmptyFilterValue } from '../../../utils/filterArrayOfObjects';

export const getFilterKeyFromPath = filterPath => filterPath.join('.');

const isUndefinedValue = value => typeof value === 'undefined';

const convertValueToString = value => `${value}`;

const getValueTranslationIdForPath = (value, filterPath) => {
  const filterKey = getFilterKeyFromPath(filterPath);

  if (isUndefinedValue(value)) {
    return `TableFilters.noneLabels.${filterKey}`;
  }

  const translationId =
    (['type', 'status'].includes(filterKey) &&
      `TasksStatusDropdown.${value}`) ||
    (filterKey === 'roles' && `roles.${value}`);

  if (!translationId) {
    return null;
  }

  return translationId;
};

const getOptionLabelTranslation = (value, filterPath) => {
  const translationId = getValueTranslationIdForPath(value, filterPath);
  return translationId ? <T id={translationId} /> : convertValueToString(value);
};

export const getOptionValueTranslation = (value, filterPath) => {
  const translationId = getValueTranslationIdForPath(value, filterPath);
  return translationId ? formatMessage(translationId) : value;
};

const getSelectOption = (value, filterPath) => ({
  label: getOptionLabelTranslation(value, filterPath),
  value: getOptionValueTranslation(value, filterPath),
});

const getSelectOptions = (filterValue, filterPath) =>
  (isEmptyFilterValue(filterValue)
    ? []
    : filterValue.map(value => getSelectOption(value, filterPath)));

const undefinedValuesExist = values => values.some(isUndefinedValue);

const removeUndefinedValues = values =>
  values.filter(value => !isUndefinedValue(value));

const isPromise = value => value && value.constructor === Promise;

const createSelectOptionsForColumn = (value, filterPath) => {
  if (isPromise(value)) {
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

const makeAsyncOptionsLoader = (promisedValue, filterPath) => () =>
  promisedValue.then(value => ({
    options: createSelectOptionsForColumn(value, filterPath),
    complete: true,
  }));

// Returns the untranslated values of the given options.
// The options are an array of label/value pair objects,
// and their value is translated, so we find their untranslated version.
const getUntranslatedOptionsValues = (
  options,
  allUntranslatedValues,
  filterPath,
) =>
  Promise.resolve(allUntranslatedValues).then((untranslatedValues) => {
    const untranslatedOptionValues = options.map(({ value: translatedValue }) =>
      untranslatedValues.find(value =>
        translatedValue === getOptionValueTranslation(value, filterPath)));

    return untranslatedOptionValues;
  });

export default withProps((props) => {
  const {
    onChange,
    filter: { path: filterPath, value: filterValue },
    value,
  } = props;

  return {
    filterKey: getFilterKeyFromPath(filterPath),
    value: getSelectOptions(filterValue, filterPath),
    options: createSelectOptionsForColumn(value, filterPath),
    loadOptions: isPromise(value)
      ? makeAsyncOptionsLoader(value, filterPath)
      : undefined,
    SelectComponent: isPromise(value) ? Select.Async : Select,
    onChange: (selectedOptions) => {
      getUntranslatedOptionsValues(selectedOptions, value, filterPath).then(onChange);
    },
  };
});
