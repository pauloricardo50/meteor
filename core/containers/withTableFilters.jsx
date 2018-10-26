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
) => WrappedComponent => props => (
  <TableFilters
    filters={generateFiltersFromProps(props)}
    data={props[dataName]}
  >
    {filteredData => (
      <WrappedComponent {...props} {...{ [dataName]: filteredData }} />
    )}
  </TableFilters>
);

export default makeTableFiltersContainer(passTableFiltersProp);
