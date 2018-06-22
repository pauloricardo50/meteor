import { withStateHandlers } from 'recompose';

const defaultSortOptions = { field: 'name', order: 'desc' };

export default withStateHandlers(
  { filterOptions: {}, sortOptions: defaultSortOptions },
  {
    handleSorting: () => sortOptions => ({ sortOptions }),
    handleFiltering: () => filterOptions => ({ filterOptions }),
  },
);
