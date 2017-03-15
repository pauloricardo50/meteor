import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Table, Column, Cell } from 'fixed-data-table';
import moment from 'moment';

export default class AllUsersTable extends Component {
  constructor(props) {
    super(props);

    this.rows = [];
    this.props.users.forEach((user, index) => {
      const row = [
        index + 1,
        user.emails[0].address.toString(),
        moment(user.createdAt).format('D MMM YY à HH:mm:ss'),
        user.roles ? user.roles.toString() : '',
        user._id,
      ];
      this.rows.push(row);
    });

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, rowIndex) {
    const id = this.rows[rowIndex][4];

    FlowRouter.go(`/admin/users/${id}`);
  }

  render() {
    return (
      <Table
        rowHeight={50}
        rowsCount={this.rows.length}
        width={510}
        height={500}
        headerHeight={50}
        onRowClick={this.handleClick}
      >
        <Column
          header={<Cell>#</Cell>}
          cell={({ rowIndex }) => (
            <Cell>
              {this.rows[rowIndex][0]}
            </Cell>
          )}
          width={40}
        />
        <Column
          header={<Cell>Email</Cell>}
          cell={({ rowIndex }) => (
            <Cell>
              {this.rows[rowIndex][1]}
            </Cell>
          )}
          width={200}
        />
        <Column
          header={<Cell>Créé le</Cell>}
          cell={({ rowIndex }) => (
            <Cell>
              {this.rows[rowIndex][2]}
            </Cell>
          )}
          width={170}
        />
        <Column
          header={<Cell>Roles</Cell>}
          cell={({ rowIndex }) => (
            <Cell>
              {this.rows[rowIndex][3]}
            </Cell>
          )}
          width={100}
        />
      </Table>
    );
  }
}

AllUsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any),
};
