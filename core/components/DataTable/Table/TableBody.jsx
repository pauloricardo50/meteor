import React from 'react';
import MuiTableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const TableBody = ({ getTableBodyProps, rows, prepareRow }) => (
  <MuiTableBody {...getTableBodyProps()}>
    {rows.map(row => {
      prepareRow(row);

      return (
        <TableRow {...row.getRowProps()}>
          {row.cells.map(cell => (
            <TableCell {...cell.getCellProps()}>
              {cell.render('Cell')}
            </TableCell>
          ))}
        </TableRow>
      );
    })}
  </MuiTableBody>
);

export default TableBody;
