import React from 'react';
import MuiTableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TableHeadCell from './TableHeadCell';

const TableHead = ({ headerGroups }) => (
  <MuiTableHead>
    {headerGroups.map(headerGroup => (
      <TableRow {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map(column => (
          <TableHeadCell
            {...column.getHeaderProps(column.getSortByToggleProps())}
            column={column}
          >
            {column.render('Header')}
          </TableHeadCell>
        ))}
      </TableRow>
    ))}
  </MuiTableHead>
);

export default TableHead;
