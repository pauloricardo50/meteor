import { Roles } from 'meteor/alanning:roles';

import React from 'react';

import { removeUser } from 'core/api/users/methodDefinitions';
import { ROLES } from 'core/api/users/userConstants';
import ConfirmMethod from 'core/components/ConfirmMethod';

const UserDeleter = ({ currentUser, user }) => {
  if (!currentUser || !Roles.userIsInRole(currentUser, ROLES.DEV)) {
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
