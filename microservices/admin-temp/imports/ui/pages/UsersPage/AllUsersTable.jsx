import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import moment from 'moment';
import Table from 'core/components/Table';

const columnOptions = [
  { id: '#', style: { width: 32, textAlign: 'left' } },
  { id: 'Email', style: { textAlign: 'left' } },
  { id: 'Créé le', style: { textAlign: 'left' } },
  { id: 'Roles', style: { textAlign: 'left' } },
  { id: 'Actions', style: { textAlign: 'left' } },
];

export default class AllUsersTable extends Component {
  constructor(props) {
    super(props);

    this.setupRows();
  }

  setupRows = () => {
    const users = this.props.data;

    this.rows = users.map((user, index) => ({
      id: user._id,
      columns: [
        index + 1,
        user.emails[0].address.toString(),
        moment(user.createdAt).format('D MMM YY à HH:mm:ss'),
        user.roles ? user.roles.toString() : '',
        <div>
          <ImpersonateLink userId={user._id} />
        </div>,
      ],
      handleClick: () => this.props.history.push(`/users/${user._id}`),
    }));
    return this.rows;
  };

  render() {
    const { isLoading } = this.props;
    if (!isLoading) {
      return (
        <Table
          columnOptions={columnOptions}
          rows={this.setupRows(this.props)}
          noIntl
        />
      );
    }
    return null;
  }
}

AllUsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
