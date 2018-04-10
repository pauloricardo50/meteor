import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import Table from 'core/components/Table';
import { T } from 'core/components/Translation/';
import Loading from 'core/components/Loading';
import { isUser } from 'core/utils/userFunctions';

import UsersTableContainer from './UsersTableContainer';
import UserAssignDropdown from '../../components/AssignAdminDropdown/UserAssignDropdown';

class UsersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.setupRows(this.props),
      columnOptions: this.getColumnOptions(this.props),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rows: this.setupRows(nextProps),
      columnOptions: this.getColumnOptions(nextProps),
    });
  }

  getColumnOptions = ({ showAssignee }) => {
    const columnOptions = [
      { id: '#', style: { width: 32, textAlign: 'left' } },
      { id: 'email', label: <T id="UsersTable.email" /> },
      { id: 'createdAt', label: <T id="UsersTable.createdAt" /> },
      { id: 'roles', label: <T id="UsersTable.roles" /> },
    ];
    if (showAssignee) {
      columnOptions.push({
        id: 'assignedTo',
        label: <T id="UsersTable.assignedTo" />,
      });
    }
    columnOptions.push({
      id: 'actions',
      label: <T id="UsersTable.actions" />,
    });
    return columnOptions;
  };

  getColumns = ({ props, index, user }) => {
    const { showAssignee } = props;
    const { emails, createdAt, roles, assignedEmployee } = user;

    const columns = [
      index + 1,
      emails[0].address.toString(),
      moment(createdAt).format('D MMM YY à HH:mm:ss'),
      roles ? roles.toString() : '',
    ];
    if (showAssignee) {
      if (assignedEmployee) {
        columns.push(assignedEmployee.username || assignedEmployee.emails[0].address);
      } else {
        columns.push('');
      }
    }

    const actionsColumnStyle = { display: 'flex' };

    const actionsColumn = isUser(user) ? (
      <div style={actionsColumnStyle}>
        <ImpersonateLink user={user} />
        <UserAssignDropdown doc={user} />
      </div>
    ) : (
      <div style={actionsColumnStyle} />
    );

    columns.push(actionsColumn);

    return columns;
  };

  setupRows = (props) => {
    const { data: users } = props;

    if (users && users.length) {
      return users.map((user, index) => ({
        id: user._id,
        columns: this.getColumns({ props, index, user }),
        handleClick: () => props.history.push(`/users/${user._id}`),
      }));
    }
    return [];
  };

  render() {
    const { isLoading } = this.props;
    const { columnOptions, rows } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    return <Table columnOptions={columnOptions} rows={rows} noIntl />;
  }
}

UsersTable.propTypes = {
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showAssignee: PropTypes.bool,
  data: PropTypes.array.isRequired,
};

UsersTable.defaultProps = {
  showAssignee: false,
};

export default withRouter(UsersTableContainer(UsersTable));
