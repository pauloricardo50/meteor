// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

type PropertyUsersProps = {
  users: Array<Object>,
};

const PropertyUsers = ({ users = [] }: PropertyUsersProps) => {
  const [firstUser, ...remainingUsers] = users.map(({ name }) => name);

  if (users.length === 0) {
    return <span>-</span>;
  }

  if (users.length === 1) {
    return <span>{firstUser}</span>;
  }

  return (
    <Tooltip
      title={[firstUser, ...remainingUsers].map(name => (
        <li key={name}>{name}</li>
      ))}
    >
      <span>
        {`${firstUser} et ${remainingUsers.length} autre${
          remainingUsers.length > 1 ? 's' : ''
        }`}
      </span>
    </Tooltip>
  );
};

export default PropertyUsers;
