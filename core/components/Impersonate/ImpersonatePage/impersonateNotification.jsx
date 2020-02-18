import React from 'react';

const impersonateNotification = email =>
  import('../../../utils/notification').then(({ default: notification }) => {
    notification.success({
      message: <span id="impersonation-success-message">Yay</span>,
      description: (
        <div>
          <p>{`Actuellement connecté comme ${email}`}</p>
        </div>
      ),
      duration: 5,
    });
  });

export default impersonateNotification;
