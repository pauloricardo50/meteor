import React from 'react';
import MuiTableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const Cell = ({ cellProps, column, render }) => {
  const { align, padding } = column;

  return (
    <TableCell {...cellProps} align={align} padding={padding}>
      {render('Cell')}
    </TableCell>
  );
};

const Row = ({ row, ...rowProps }) => (
  <TableRow {...rowProps} hover selected={row.isSelected}>
    {row.cells.map(({ column, getCellProps, render }) => {
      const { key, ...cellProps } = getCellProps();

      return (
        <Cell key={key} cellProps={cellProps} column={column} render={render} />
      );
    })}
  </TableRow>
);

const TableBody = ({ getTableBodyProps, rows, prepareRow }) => (
  <MuiTableBody {...getTableBodyProps()}>
    {rows.map(row => {
      prepareRow(row);
      const { key, ...rowProps } = row.getRowProps();

      return <Row row={row} key={key} {...rowProps} />;
    })}
  </MuiTableBody>
);

export default TableBody;
