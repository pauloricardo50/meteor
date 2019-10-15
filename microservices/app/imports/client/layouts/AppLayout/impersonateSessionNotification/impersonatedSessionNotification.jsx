import React from 'react';
import Button from 'core/components/Button';

import { followImpersonatedSession } from 'core/api/sessions/methodDefinitions';
import { employeesById } from 'core/arrays/epotekEmployees';

const impersonatedSessionNotification = ({ impersonatedSession, history }) => {
  const {
    connectionId,
    lastPageVisited,
    adminImpersonating: {
      name: adminName,
      _id: adminId,
      firstName: adminFirstName,
    } = {},
  } = impersonatedSession;

  const adminImage = employeesById[adminId].src;

  return import('../../../../core/utils/notification').then(({ default: notification }) => {
    notification.close('impersonateNotification');
    notification.info({
      message: `${adminName
          || 'Un conseiller'} est en train de travailler sur votre dossier`,
      description: (
        <div className="p-8 flex-row center" style={{ marginLeft: '-48px' }}>
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
            {`Suivre ${adminFirstName}`}
          </Button>
        </div>
      ),
      duration: 0,
      key: 'impersonateNotification',
      icon: (
        <img
          src={adminImage}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            marginLeft: '-16px',
          }}
        />
      ),
    });
  });
};

export default impersonatedSessionNotification;
