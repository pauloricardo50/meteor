import { compose, withStateHandlers, withProps } from 'recompose';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';

import T from '../../Translation';
import { isEmptyFilterValue } from '../../../utils/filteringFunctions';

const getSelectOption = (value, filterPath) => ({
  label: getSelectOptionLabel(value, filterPath),
  value,
});

const getSelectOptions = (filterValue, filterPath) =>
  (isEmptyFilterValue(filterValue)
    ? []
    : filterValue.map(value => getSelectOption(value, filterPath)));

// Translate the label when it should be translated
const getTranslationOfValueForPath = (value, filterPath) => {
  const lastKey = filterPath[filterPath.length - 1];
  const filterKey = getFilterKeyFromPath(filterPath);

  const translationId = filterKey === 'type' && `TasksStatusDropdown.${value}`;

  if (!translationId) {
    return null;
  }

  return T({ id: translationId });
};

const getSelectOptionLabel = (value, filterPath) => {
  if (!value) {
    return T({ id: 'TableFilters.none' });
  }

  return getTranslationOfValueForPath(value, filterPath) || value;
};

const getFilterKeyFromPath = filterPath => filterPath.join('.');

const createSelectOptionsForColumn = (filterPath, data) => {
  const options = data.map((item) => {
    const itemValue = get(item, filterPath);
    return getSelectOption(itemValue, filterPath);
  });

  return uniqBy(options, option => option.value);
};

// TODO take care of STATE
const makeHandleFiltersChanged = filterPath => (newSelectOptions) => {
  const { filters } = this.state;
  const newFilterValue = newSelectOptions.map(option => option.value);

  const newFilters = set(filters, filterPath, newFilterValue);
  this.setState({ filters: newFilters });
};

const withFiltersState = withStateHandlers(({ filters }) => ({ filters }), {
  handleOnChange: ({ filters }) => (filterPath, newSelectOptions) => {
    const newFilterValue = newSelectOptions.map(option => option.value);
    const newFilters = set(cloneDeep(filters), filterPath, newFilterValue);

    return { filters: newFilters };
  },
});

export default compose(
  withFiltersState,
  withProps(({ setFilters }) => ({
    getSelectOptions,
    getSelectOption,
    getSelectOptionLabel,
    getTranslationOfValueForPath,
    getFilterKeyFromPath,
    createSelectOptionsForColumn,
  })),
);
