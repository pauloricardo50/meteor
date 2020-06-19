import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import MuiTableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TableHeadCell from './TableHeadCell';

const TableHead = ({ headerGroups, loading }) => (
  <MuiTableHead style={{ position: 'relative' }}>
    {headerGroups.map(({ getHeaderGroupProps, headers }) => (
      <TableRow {...getHeaderGroupProps()}>
        {headers.map(column => (
          <TableHeadCell
            {...column.getHeaderProps(column.getSortByToggleProps())}
            column={column}
          >
            {column.render('Header')}
          </TableHeadCell>
        ))}
      </TableRow>
    ))}
    {loading && (
      <LinearProgress
        style={{ position: 'absolute', width: '100%' }}
        variant="query"
        className="animated fadeIn delay-200"
      />
    )}
  </MuiTableHead>
);

export default TableHead;
