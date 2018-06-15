import React from 'react';
import { branch } from 'recompose';

import TableFilters from '../components/Table/TableFilters';

const withTableFilters = branch(
  ({ tableFilters }) => !!tableFilters,
  WrapperComponent => props => (
    <TableFilters filters={props.tableFilters} data={props.data}>
      {filteredData => <WrapperComponent {...props} data={filteredData} />}
    </TableFilters>
  ),
);

export default withTableFilters;
