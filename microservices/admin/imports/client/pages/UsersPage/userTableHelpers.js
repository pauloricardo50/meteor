import React from 'react';
import moment from 'moment';
import Link from 'core/components/Link';

import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import T from 'core/components/Translation/';
import { isUser } from 'core/utils/userFunctions';
import Roles from 'core/components/Roles';

export const getColumnOptions = ({ showAssignee }) => {
  const columnOptions = [
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

const getColumns = ({ showAssignee, user }) => {
  const { email, createdAt, roles, assignedEmployee, name } = user;

  const columns = [
    name,
    email,
    {
      raw: createdAt.getTime(),
      label: moment(createdAt).fromNow(),
    },
    { label: <Roles roles={roles} />, raw: roles && roles.toString() },
  ];
  if (showAssignee) {
    if (assignedEmployee) {
      const text = assignedEmployee.name;
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
    </div>
  ) : (
    <div style={actionsColumnStyle} />
  );
  columns.push(actionsColumn);

  return columns;
};

export const getRows = ({ data: users, history, showAssignee }) => {
  if (users && users.length) {
    return users.map(user => ({
      id: user._id,
      columns: getColumns({ showAssignee, user }),
      handleClick: event => {
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
