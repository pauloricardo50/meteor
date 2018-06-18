import { compose, withStateHandlers, withProps } from 'recompose';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';

import T from '../../Translation';
import { isEmptyFilterValue } from '../../../utils/filterArrayOfObjects';

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

export const getFilterKeyFromPath = filterPath => filterPath.join('.');

const createSelectOptionsForColumn = (filterPath, data) => {
  const options = data.map((item) => {
    const itemValue = get(item, filterPath);
    return getSelectOption(itemValue, filterPath);
  });

  return uniqBy(options, option => option.value);
};

export default withProps(({ onChange, data, filter: { path: filterPath, value: filterValue } }) => ({
  filterKey: getFilterKeyFromPath(filterPath),
  value: getSelectOptions(filterValue, filterPath),
  options: createSelectOptionsForColumn(filterPath, data),
  onChange,
}));
