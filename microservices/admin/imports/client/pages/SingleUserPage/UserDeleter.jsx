import React from 'react';

import ConfirmMethod from 'core/components/ConfirmMethod';
import { ROLES } from 'core/api/constants';
import { removeUser } from 'core/api';

const UserDeleter = ({ currentUser, user }) => {
  if (!currentUser || !currentUser.roles.includes(ROLES.DEV)) {
    return null;
  }

  return (
    <ConfirmMethod
      method={() => removeUser.run({ userId: user._id })}
      label="Supprimer"
      keyword="SUPPRIMER"
      type="modal"
    />
  );
};

export default UserDeleter;
