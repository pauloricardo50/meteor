import React from 'react';

const impersonateNotification = emails =>
  import('../../../utils/notification').then(({ default: notification }) => {
    notification.success({
      message: <span id="impersonation-success-message">Yay</span>,
      description: (
        <div>
          <p>{`Acutellement connecté comme ${emails[0].address}`}</p>
        </div>
      ),
      duration: 5,
    });
  });

export default impersonateNotification;
