import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import moment from 'moment';
import Table from 'core/components/Table';
import { T } from 'core/components/Translation/';
import UsersTableContainer from './UsersTableContainer';

class UsersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.setupRows(this.props),
      columnOptions: this.getColumnOptions(this.props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const newRows = this.setupRows(nextProps);
    this.setState({
      rows: newRows,
      columnOptions: this.getColumnOptions(nextProps),
    });
  }


  getColumnOptions = ({ showAssignee }) => {
    const columnOptions = [
      { id: '#', style: { width: 32, textAlign: 'left' } },
      { id: <T id="UsersTable.email" /> },
      { id: <T id="UsersTable.createdAt" /> },
      { id: <T id="UsersTable.roles" /> },
    ];
    if (showAssignee) {
      columnOptions.push({
        id: <T id="UsersTable.assignedTo" />,
      });
    }
    columnOptions.push({
      id: <T id="UsersTable.actions" />,
    });
    return columnOptions;
  };

  getColumns = ({ props, index, user }) => {
    const columns = [
      index + 1,
      user.emails[0].address.toString(),
      moment(user.createdAt).format('D MMM YY à HH:mm:ss'),
      user.roles ? user.roles.toString() : '',
      
    ];
    if (props.showAssignee) {
      columns.push((user.assignedEmployee &&
          (user.assignedEmployee.username ||
            user.assignedEmployee.emails[0].address.toString())) ||
          '');
    }

    columns.push(<div>
      <div>
        <ImpersonateLink userId={user._id} />
      </div>
                 </div>);

    return columns;
  };

  setupRows = (props) => {
    const users = props.data;

    if (users && users.length) {
      this.rows = users.map((user, index) => ({
        id: user._id,
        columns: this.getColumns({
          props,
          index,
          user,
        }),
        handleClick: () => this.props.history.push(`/users/${user._id}`),
      }));
      return this.rows;
    }
    return [];
  };

  render() {
    const { isLoading } = this.props;
    const { columnOptions, rows } = this.state;

    if (!isLoading) {
      return (
        <Table
          columnOptions={columnOptions}
          rows={rows}
          noIntl
          showAssignee
        />
      );
    }
    return null;
  }
}

UsersTable.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default UsersTableContainer(UsersTable);
