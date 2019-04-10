// NOTE: A great way to refactor this would be to use only async options
// by Promistifying the `value` and thus be able to use only
// `loadOptions` prop & Select.Async and remove `options` and Select component
// However, many tests are based on the `options` prop, so they should be refactored
import React from 'react';
import { withProps, compose } from 'recompose';
import uniq from 'lodash/uniq';
import Select from 'react-select';
import { injectIntl } from 'react-intl';

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

  const translationId = (['type', 'status'].includes(filterKey) && `TaskStatusSetter.${value}`)
    || (filterKey === 'roles' && `roles.${value}`);

  if (!translationId) {
    return null;
  }

  return translationId;
};

const getOptionLabelTranslation = (value, filterPath) => {
  const translationId = getValueTranslationIdForPath(value, filterPath);
  return translationId ? <T id={translationId} /> : convertValueToString(value);
};

const getOptionValueTranslation = (value, filterPath, formatMessage) => {
  const translationId = getValueTranslationIdForPath(value, filterPath);
  return translationId ? formatMessage({ id: translationId }) : value;
};

const getSelectOption = (value, filterPath, formatMessage) => ({
  label: getOptionLabelTranslation(value, filterPath),
  value: getOptionValueTranslation(value, filterPath, formatMessage),
});

const getSelectOptions = (filterValue, filterPath, formatMessage) =>
  (isEmptyFilterValue(filterValue)
    ? []
    : filterValue.map(value =>
      getSelectOption(value, filterPath, formatMessage)));

const undefinedValuesExist = values => values.some(isUndefinedValue);

const removeUndefinedValues = values =>
  values.filter(value => !isUndefinedValue(value));

const isPromise = value => value && value.constructor === Promise;

const createSelectOptionsForColumn = (value, filterPath, formatMessage) => {
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
    getSelectOption(optionValue, filterPath, formatMessage));
};

const makeAsyncOptionsLoader = (
  promisedValue,
  filterPath,
  formatMessage,
) => () =>
  promisedValue.then(value => ({
    options: createSelectOptionsForColumn(value, filterPath, formatMessage),
    complete: true,
  }));

// get the untranslated value by finding the original value of which
// translation is the same
const getUntranslatedValue = (
  translation,
  filterOptions,
  filterPath,
  formatMessage,
) =>
  filterOptions.find(value =>
    translation
      === getOptionValueTranslation(value, filterPath, formatMessage));

// Returns the untranslated values of the given dropdown options.
// The dropdown options are an array of label/value pair objects,
// and their value is translated, so we find & return
//  their untranslated corresponding values
const getUntranslatedValues = (
  translatedValues,
  filterOptions,
  filterPath,
  formatMessage,
) =>
  // promisify `filterOptions` because it can be either an array of a Promise
  Promise.resolve(filterOptions).then(resolvedFilterOptions =>
    translatedValues.map(translation =>
      getUntranslatedValue(
        translation,
        resolvedFilterOptions,
        filterPath,
        formatMessage,
      )));

export default compose(
  injectIntl,
  withProps((props) => {
    const {
      onChange,
      filter: { path: filterPath, value: filterValue },
      options: filterOptions,
      intl: { formatMessage },
    } = props;

    return {
      filterKey: getFilterKeyFromPath(filterPath),
      value: getSelectOptions(filterValue, filterPath, formatMessage),
      options: createSelectOptionsForColumn(
        filterOptions,
        filterPath,
        formatMessage,
      ),
      loadOptions: isPromise(filterOptions)
        ? makeAsyncOptionsLoader(filterOptions, filterPath, formatMessage)
        : undefined,
      SelectComponent: isPromise(filterOptions) ? Select.Async : Select,
      onChange: (selectedOptions) => {
        const selectedOptionValues = selectedOptions.map(({ value }) => value);
        getUntranslatedValues(
          selectedOptionValues,
          filterOptions,
          filterPath,
          formatMessage,
        ).then(onChange);
      },
    };
  }),
);
