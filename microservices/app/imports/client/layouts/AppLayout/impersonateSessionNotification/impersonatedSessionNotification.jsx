import React from 'react';
import Button from 'core/components/Button';

import { followImpersonatedSession } from 'core/api/sessions/methodDefinitions';

const impersonatedSessionNotification = ({ impersonatedSession, history }) => {
  const { connectionId, lastPageVisited } = impersonatedSession;

  return import('../../../../core/utils/notification').then(({ default: notification }) => {
    notification.close('impersonateNotification');
    notification.info({
      message: 'Un conseiller est en train de travailler sur votre dossier',
      description: (
        <div className="p-8">
          <Button
            onClick={() => {
              followImpersonatedSession.run({ connectionId }).then(() => {
                history.push(lastPageVisited);
                notification.destroy();
              });
            }}
            outlined
            primary
          >
              Se rendre sur la même page
          </Button>
        </div>
      ),
      duration: 0,
      key: 'impersonateNotification',
    });
  });
};

export default impersonatedSessionNotification;
