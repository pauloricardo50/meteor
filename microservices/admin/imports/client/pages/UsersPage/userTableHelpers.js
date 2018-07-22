import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import T from 'core/components/Translation/';
import { getUserDisplayName, isUser } from 'core/utils/userFunctions';
import Roles from 'core/components/Roles';

import UserAssignDropdown from '../../components/AssignAdminDropdown/UserAssignDropdown';

export const getColumnOptions = ({ showAssignee }) => {
  const columnOptions = [
    { id: '#', style: { width: 32, textAlign: 'left' } },
    { id: 'name', label: <T id="UsersTable.name" /> },
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

const getColumns = ({ showAssignee, index, user }) => {
  const {
    emails,
    createdAt,
    roles,
    assignedEmployee,
    firstName,
    lastName,
    username,
  } = user;

  const columns = [
    index + 1,
    getUserDisplayName({ firstName, lastName, username, emails }),
    emails[0].address.toString(),
    moment(createdAt).format('D MMM YY à HH:mm:ss'),
    { label: <Roles roles={roles} />, raw: roles && roles.toString() },
  ];
  if (showAssignee) {
    if (assignedEmployee) {
      const text = getUserDisplayName({
        firstName: assignedEmployee.firstName,
        lastName: assignedEmployee.lastName,
        username: assignedEmployee.username,
        emails: assignedEmployee.emails,
      });
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

export const getRows = ({ data: users, history, showAssignee }) => {
  if (users && users.length) {
    return users.map((user, index) => ({
      id: user._id,
      columns: getColumns({ showAssignee, index, user }),
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
