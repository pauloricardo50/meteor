import React from 'react';
import PropTypes from 'prop-types';

import Table from 'core/components/Table';

import BorrowersTableContainer from './BorrowersTableContainer';

const BorrowersTable = ({ rows, columnOptions }) => (
  <Table
    columnOptions={columnOptions}
    rows={rows}
    noIntl
    className="borrowers-table"
  />
);

BorrowersTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default BorrowersTableContainer(BorrowersTable);
