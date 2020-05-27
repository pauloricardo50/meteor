import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { employeesById } from '../../arrays/epotekEmployees';
import T from '../Translation';
import UserImpersonateNotificationButton from './UserImpersonateNotificationButton';
import UserImpersonateNotificationDialog from './UserImpersonateNotificationDialog';

const UserImpersonateNotification = ({ impersonatedSession, options }) => {
  const {
    lastPageVisited,
    impersonatingAdmin: { _id: adminId, firstName: adminFirstName } = {},
  } = impersonatedSession;

  const { followAdmin } = options;

  const history = useHistory();
  const adminImage = employeesById[adminId].src;
  const isAdminOnSamePage = history.location.pathname === lastPageVisited;

  useEffect(() => {
    if (followAdmin && !isAdminOnSamePage) {
      history.push(lastPageVisited);
    }
  }, [isAdminOnSamePage]);

  return (
    <>
      <UserImpersonateNotificationDialog
        impersonatedSession={impersonatedSession}
        options={options}
      />
      <div className="impersonate-notification">
        <img src={adminImage} />
        <h4>
          {followAdmin ? (
            <T
              id="ImpersonateNotification.following"
              values={{ adminFirstName }}
            />
          ) : (
            <T
              id="ImpersonateNotification.follow"
              values={{ adminFirstName }}
            />
          )}
        </h4>
        <UserImpersonateNotificationButton
          impersonatedSession={impersonatedSession}
          options={options}
        />
      </div>
    </>
  );
};

export default UserImpersonateNotification;
