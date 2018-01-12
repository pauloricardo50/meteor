import React from 'react';
import PropTypes from 'prop-types';

import { MuiTableFooter, TablePagination } from 'material-ui/Table';

const TableFooter = ({
  rowCount,
  rowsPerPage,
  page,
  onChangePage,
  onChangeRowsPerPage,
}) => (
  <MuiTableFooter>
    <TablePagination
      count={rowCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      labelRowsPerPage="Lignes par page"
    />
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
