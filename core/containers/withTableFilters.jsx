import React from 'react';
import { branch } from 'recompose';

import TableFilters from '../components/Table/TableFilters';

/**
 * Use this HoC when you want the initial component to
 * be wrapped inside the filters and be bassed the filtered data
 */

const withTableFilters = branch(
  ({ tableFilters }) => !!tableFilters,
  WrappedComponent => props => (
    <TableFilters filters={props.tableFilters} data={props.data}>
      {filteredData => <WrappedComponent {...props} data={filteredData} />}
    </TableFilters>
  ),
);

export default withTableFilters;
