import { compose, withStateHandlers, withProps, lifecycle } from 'recompose';

import { appendFilters } from './DetailSideNavFilters/filterOptions';

// const defaultFilterOptions = { field: 'name', order: 'desc' };
const defaultSortOptions = { field: 'name', order: 'desc' };

const withFilterState = withStateHandlers(
  props => {
    return {
      selectedFilterOptions: {},
      selectedSortOptions: defaultSortOptions,
    };
  },
  {
    handleSorting: () => selectedSortOptions => ({ selectedSortOptions }),
  },
);

export default compose(
  withFilterState,
  withProps(({ filters }) => {
    console.log('>>>', filters);
    return {
      filterOptions: appendFilters(filters),
    };
  }),
);
