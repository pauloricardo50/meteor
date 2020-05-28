import React from 'react';

import AdminImpersonateNotification from './AdminImpersonateNotification';
import UserImpersonateNotification from './UserImpersonateNotification';

const ImpersonateNotification = ({ impersonatedSession, options }) => {
  const { shouldRenderAdminNotification } = options;

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
