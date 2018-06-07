import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';

import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import Table from 'core/components/Table';
import T from 'core/components/Translation/';
import Loading from 'core/components/Loading';
import { isUser } from 'core/utils/userFunctions';
import Roles from 'core/components/Roles';

import UsersTableContainer from './UsersTableContainer';
import UserAssignDropdown from '../../components/AssignAdminDropdown/UserAssignDropdown';

const getColumnOptions = ({ showAssignee }) => {
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

const getColumns = ({ props, index, user }) => {
  const { showAssignee } = props;
  const { emails, createdAt, roles, assignedEmployee } = user;

  const columns = [
    index + 1,
    emails[0].address.toString(),
    moment(createdAt).format('D MMM YY à HH:mm:ss'),
    { label: <Roles roles={roles} />, raw: roles && roles.toString() },
  ];
  if (showAssignee) {
    if (assignedEmployee) {
      const text =
        assignedEmployee.username || assignedEmployee.emails[0].address;
      columns.push({
        label: <Link to={`/users/${assignedEmployee._id}`}>{text}</Link>,
        raw: text,
      });
    } else {
      columns.push({ label: '', raw: '' });
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

const getRows = (props) => {
  const { data: users, history } = props;

  if (users && users.length) {
    return users.map((user, index) => ({
      id: user._id,
      columns: getColumns({ props, index, user }),
      handleClick: (event) => {
        if (event.target.href) {
          event.stopPropagation();
        } else {
          history.push(`/users/${user._id}`);
        }
      },
    }));
  }
  return [];
};

const UsersTable = (props) => {
  const { isLoading } = props;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Table
      columnOptions={getColumnOptions(props)}
      rows={getRows(props)}
      noIntl
      className="users-table"
    />
  );
};

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
