import React from 'react';
import TableCell from '@material-ui/core/TableCell';

import Checkbox from '../../Material/Checkbox';

const TableCheckbox = props => (
  <TableCell padding="checkbox">
    <Checkbox {...props} />
  </TableCell>
);

export default TableCheckbox;
