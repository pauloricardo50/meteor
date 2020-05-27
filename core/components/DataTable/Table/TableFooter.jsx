import React from 'react';
import MuiTableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import TableOptions from './TableOptions';

export const paginationOptions = [10, 25, 50];

const TableFooter = ({
  allColumns,
  gotoPage,
  pageCount,
  pageIndex,
  pageSize,
  rowCount,
  setPageSize,
}) => {
  if (pageCount <= 1 && rowCount < paginationOptions[0]) {
    return null;
  }

  return (
    <MuiTableFooter>
      <TableRow>
        <TableOptions allColumns={allColumns} />
        <TablePagination
          count={rowCount}
          onChangePage={(event, page) => {
            console.log('onChangePage??', page);

            gotoPage(page);
          }}
          onChangeRowsPerPage={event =>
            setPageSize(parseInt(event.target.value, 10))
          }
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={paginationOptions}
        />
      </TableRow>
    </MuiTableFooter>
  );
};

export default TableFooter;
