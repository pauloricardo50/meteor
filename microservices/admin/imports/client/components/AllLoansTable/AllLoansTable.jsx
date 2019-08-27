import React from 'react';
import PropTypes from 'prop-types';

import Table, { ORDER } from 'core/components/Table';
import AllLoansTableContainer from './AllLoansTableContainer';

const AllLoansTable = ({ columnOptions, rows }) => (
  <Table
    columnOptions={columnOptions}
    rows={rows}
    noIntl
    clickable
    initialOrder={ORDER.DESC}
  />
);

AllLoansTable.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  loans: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default AllLoansTableContainer(AllLoansTable);
