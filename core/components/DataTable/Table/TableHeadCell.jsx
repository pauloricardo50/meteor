import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const TableHeadCell = ({ children, column, ...props }) => {
  if (column.canSort) {
    return (
      <TableCell {...props}>
        <TableSortLabel
          active={column.isSorted}
          direction={column.isSortedDesc ? 'desc' : 'asc'}
        >
          {children}
        </TableSortLabel>
      </TableCell>
    );
  }

  return <TableCell {...props}>{children}</TableCell>;
};

export default TableHeadCell;
