import React from 'react';

import useImpersonatedSession from '../../hooks/useImpersonatedSession';
import AdminImpersonateNotification from './AdminImpersonateNotification';
import UserImpersonateNotification from './UserImpersonateNotification';

const ImpersonateNotification = () => {
  const [impersonatedSession, options] = useImpersonatedSession();

  const { shouldRenderNotification, shouldRenderAdminNotification } = options;

  if (!shouldRenderNotification) {
    return null;
  }

  return shouldRenderAdminNotification ? (
    <AdminImpersonateNotification
      impersonatedSession={impersonatedSession}
      options={options}
    />
  ) : (
    <UserImpersonateNotification
      impersonatedSession={impersonatedSession}
      options={options}
    />
  );
};

export default ImpersonateNotification;
