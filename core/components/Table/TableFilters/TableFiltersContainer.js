import { withStateHandlers } from 'recompose';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

const withFiltersState = withStateHandlers(({ filters }) => ({ filters }), {
  handleOnChange: ({ filters }) => (filterPath, selectedOptions) => {
    const newFilterValue = selectedOptions.map(option => option.value);
    const newFilters = set(cloneDeep(filters), filterPath, newFilterValue);

    return { filters: newFilters };
  },
});

export default withFiltersState;
