import React from 'react';

import TableFilters from '../components/Table/TableFilters';

/**
 * Use this HoC when you want the initial component to
 * be wrapped inside the filters and be bassed the filtered data
 */

export const makeTableFiltersContainer = generateFiltersFromProps => WrappedComponent => props => (
  <TableFilters filters={generateFiltersFromProps(props)} data={props.data}>
    {filteredData => <WrappedComponent {...props} data={filteredData} />}
  </TableFilters>
);

const passTableFiltersProp = ({ tableFilters }) => tableFilters;
export default makeTableFiltersContainer(passTableFiltersProp);
