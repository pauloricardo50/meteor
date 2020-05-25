import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const TableHeadCell = ({ children, column, ...props }) => {
  const { align, padding } = column;

  if (column.canSort) {
    return (
      <TableCell {...props} align={align} padding={padding}>
        <TableSortLabel
          active={column.isSorted}
          direction={column.isSortedDesc ? 'desc' : 'asc'}
        >
          {children}
        </TableSortLabel>
      </TableCell>
    );
  }

  return (
    <TableCell {...props} align={align} padding={padding}>
      {children}
    </TableCell>
  );
};

export default TableHeadCell;
