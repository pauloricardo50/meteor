import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Table from 'core/components/Table';
import UsersTableContainer from './UsersTableContainer';

const UsersTable = ({ options: { columnOptions, rows } }) => (
  <Table
    columnOptions={columnOptions}
    rows={rows}
    noIntl
    className="users-table"
  />
);

UsersTable.propTypes = {
  options: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  UsersTableContainer,
)(UsersTable);
