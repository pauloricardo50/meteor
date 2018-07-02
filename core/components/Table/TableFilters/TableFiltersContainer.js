import { withStateHandlers, withProps, lifecycle } from 'recompose';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';

import { Composer } from 'core/api';

const withState = withStateHandlers(({ filters = {} }) => ({ filters }), {
  handleOptionsSelect: ({ filters }) => (filterPath, selectedOptions) => {
    const newFilterValue = selectedOptions.map(option => option.value);
    const newFilters = set(
      cloneDeep(filters.filters),
      filterPath,
      newFilterValue,
    );

    return { filters: { ...filters, filters: newFilters } };
  },

  handleFiltersChange: () => filters => ({
    filters,
  }),

  handleDataChange: () => data => ({
    data,
  }),
});

export default Composer.compose(
  withState,

  lifecycle({
    componentDidUpdate(prevProps) {
      const {
        filters: currentFiltersProp,
        data: currentDataProp,
        handleDataChange,
        handleFiltersChange,
      } = this.props;
      const { filters: oldFiltersProp, data: oldDataProp } = prevProps;

      if (!isEqual(currentDataProp, oldDataProp)) {
        handleDataChange(currentDataProp);
      }

      if (!isEqual(currentFiltersProp, oldFiltersProp)) {
        handleFiltersChange(currentFiltersProp);
      }
    },
  }),

  withProps(({ filters: { filters } }) => ({
    pickOptionsForFilter(options = {}, { path }) {
      const lastFilterKey = path[path.length - 1];
      return options[lastFilterKey];
    },
    renderFilters: filters && Object.keys(filters).length > 0,
  })),
);
