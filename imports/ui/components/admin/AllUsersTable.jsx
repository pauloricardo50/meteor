import PropTypes from 'prop-types';
import React, { Component } from 'react';

import moment from 'moment';
import Table from '/imports/ui/components/general/Table.jsx';

const columns = [
  { name: '#', style: { width: 32, textAlign: 'left' } },
  { name: 'Email', style: { textAlign: 'left' } },
  { name: 'Créé le', style: { textAlign: 'left' } },
  { name: 'Roles', style: { textAlign: 'left' } },
];

export default class AllUsersTable extends Component {
  constructor(props) {
    super(props);

    this.setupRows();
  }

  setupRows = () => {
    this.rows = this.props.users.map((user, index) => ({
      id: user._id,
      columns: [
        index + 1,
        user.emails[0].address.toString(),
        moment(user.createdAt).format('D MMM YY à HH:mm:ss'),
        user.roles ? user.roles.toString() : '',
      ],
      handleClick: () => this.props.history.push(`/admin/users/${user._id}`),
    }));
  };

  render() {
    return (
      <Table
        height="500px"
        selectable={false}
        columns={columns}
        rows={this.rows}
      />
    );
  }
}

AllUsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
