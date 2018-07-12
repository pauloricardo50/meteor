import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Table from 'core/components/Table';

import UsersTableContainer from './UsersTableContainer';

const UsersTable = ({ options: { getColumnOptions, getRows } }) => (
  <Table
    columnOptions={getColumnOptions}
    rows={getRows}
    noIntl
    className="users-table"
  />
);

UsersTable.propTypes = {
  options: PropTypes.object.isRequired,
};

export default withRouter(UsersTableContainer(UsersTable));
