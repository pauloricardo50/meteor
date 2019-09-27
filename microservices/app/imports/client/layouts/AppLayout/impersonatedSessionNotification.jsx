import { Meteor } from 'meteor/meteor';
import React from 'react';
import Button from 'core/components/Button';

import {
  followImpersonatedSession,
  shareImpersonatedSession,
} from 'core/api/sessions/methodDefinitions';

const impersonatedSessionNotification = ({ impersonatedSession, history }) => {
  if (impersonatedSession) {
    const {
      connectionId,
      lastPageVisited,
      shared,
      impersonatedUserLastPageVisited,
    } = impersonatedSession;
    const currentSessionId = Meteor.connection._lastSessionId;

    if (connectionId === currentSessionId) {
      const isUserOnSamePage = history.location.pathname === impersonatedUserLastPageVisited;

      return import('../../../core/utils/notification').then(({ default: notification }) => {
        notification.close('impersonateNotification');
        notification.info({
          message: 'Partage de session',
          description: (
            <div className="p-8">
              {shared
                  && (isUserOnSamePage ? (
                    <p className="success">
                      Le client est sur la même page que vous
                    </p>
                  ) : (
                    <p className="error">
                      Le client est sur une page différente
                    </p>
                  ))}
              <Button
                onClick={() =>
                  shareImpersonatedSession.run({ share: !shared })
                }
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
      });
    }

    if (!shared) {
      return;
    }

    return import('../../../core/utils/notification').then(({ default: notification }) => {
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
  }
};

export default impersonatedSessionNotification;
