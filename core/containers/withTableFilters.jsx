import React from 'react';

import TableFilters from '../components/Table/TableFilters';

const passTableFiltersProp = ({ tableFilters }) => tableFilters;

/**
 * Use this HoC when you want the initial component to
 * be wrapped inside the filters and be bassed the filtered data
 */
export const makeTableFiltersContainer = (
  generateFiltersFromProps = passTableFiltersProp,
  dataName = 'data',
) => WrappedComponent => (props) => {
  const filters = generateFiltersFromProps(props);
  const unfilteredData = props[dataName];
  return (
    <TableFilters filters={filters} data={unfilteredData}>
      {filteredData => (
        <WrappedComponent {...props} {...{ [dataName]: filteredData }} />
      )}
    </TableFilters>
  );
};

export default makeTableFiltersContainer(passTableFiltersProp);
