import React from 'react';
import Button from 'core/components/Button';

import { shareImpersonatedSession } from 'core/api/sessions/methodDefinitions';

const impersonatingSessionNotification = ({ impersonatedSession, history }) => {
  const {
    shared,
    impersonatedUserLastPageVisited,
    userIsConnected,
  } = impersonatedSession;

  const isUserOnSamePage =
    history.location.pathname === impersonatedUserLastPageVisited;

  if (userIsConnected) {
    return import('../../../../core/utils/notification').then(
      ({ default: notification }) => {
        notification.close('impersonateNotification');
        notification.info({
          message: 'Le client est connecté',
          description: (
            <div className="p-8">
              {shared &&
                (isUserOnSamePage ? (
                  <p className="success">
                    Le client est sur la même page que vous
                  </p>
                ) : (
                  <p className="error">Le client est sur une page différente</p>
                ))}
              <Button
                onClick={() => shareImpersonatedSession.run({ share: !shared })}
                primary
                outlined
              >
                {shared
                  ? 'Arrêter le partage de session'
                  : 'Partager la session'}
              </Button>
            </div>
          ),
          duration: 0,
          key: 'impersonateNotification',
        });
      },
    );
  }

  if (!shared) {
    return import('../../../../core/utils/notification').then(
      ({ default: notification }) => {
        notification.close('impersonateNotification');
      },
    );
  }
};

export default impersonatingSessionNotification;
