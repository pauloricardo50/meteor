import React from 'react';
import MuiTableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const TableBody = ({ getTableBodyProps, rows, prepareRow }) => (
  <MuiTableBody {...getTableBodyProps()}>
    {rows.map(row => {
      prepareRow(row);

      return (
        <TableRow {...row.getRowProps()} hover selected={row.isSelected}>
          {row.cells.map(({ column, getCellProps, render }) => {
            const { align, padding } = column;
            return (
              <TableCell {...getCellProps()} align={align} padding={padding}>
                {render('Cell')}
              </TableCell>
            );
          })}
        </TableRow>
      );
    })}
  </MuiTableBody>
);

export default TableBody;
