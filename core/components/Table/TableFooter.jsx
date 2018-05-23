import React from 'react';
import PropTypes from 'prop-types';

import MuiTableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const TableFooter = ({
  rowCount,
  rowsPerPage,
  page,
  onChangePage,
  onChangeRowsPerPage,
}) => (
  <MuiTableFooter>
    <TableRow>
      <TablePagination
        count={rowCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        labelRowsPerPage="Lignes par page"
      />
    </TableRow>
  </MuiTableFooter>
);

TableFooter.propTypes = {
  rowCount: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
};

export default TableFooter;
