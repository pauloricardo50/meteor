// @flow
import React from 'react';

import ConfirmMethod from 'core/components/ConfirmMethod';
import { ROLES, USER_QUERIES } from 'core/api/constants';
import { removeUser } from 'core/api';
import ClientEventService from 'core/api/events/ClientEventService/index';

type UserDeleterProps = {};

const UserDeleter = ({ currentUser, user }: UserDeleterProps) => {
  if (!currentUser || !currentUser.roles.includes(ROLES.DEV)) {
    return null;
  }

  return (
    <ConfirmMethod
      method={() =>
        removeUser
          .run({ userId: user._id })
          .then(() => ClientEventService.emit(USER_QUERIES.ADMIN_USER))
      }
      label="Supprimer"
      keyword="SUPPRIMER"
    />
  );
};

export default UserDeleter;
