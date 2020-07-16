import React from 'react';
import { useHistory } from 'react-router-dom';

import { followImpersonatedSession } from '../../api/sessions/methodDefinitions';
import { employeesById } from '../../arrays/epotekEmployees';
import Button from '../Button';
import Icon from '../Icon';
import Dialog from '../Material/Dialog';
import T from '../Translation';

const UserImpersonateNotificationDialog = ({
  impersonatedSession,
  options: { showUserDialog, setShowUserDialog, setFollowAdmin },
}) => {
  const {
    connectionId,
    lastPageVisited,
    impersonatingAdmin: {
      name: adminName,
      _id: adminId,
      firstName: adminFirstName,
    } = {},
  } = impersonatedSession;
  const adminImage = employeesById[adminId].src;

  const history = useHistory();

  return (
    <Dialog open={showUserDialog}>
      <div className="impersonate-notification-dialog">
        <img src={adminImage} />
        <h3>{adminName}</h3>
        <p>
          <T
            id="ImpersonateNotification.dialog.description"
            values={{ adminFirstName }}
          />
        </p>
        <div className="actions">
          <Button
            raised
            secondary
            onClick={() => {
              followImpersonatedSession.run({ connectionId, follow: true });
              history.push(lastPageVisited);
              setFollowAdmin(true);
              setShowUserDialog(false);
            }}
            label={
              <T
                id="ImpersonateNotification.follow"
                values={{ adminFirstName }}
              />
            }
            size="large"
            icon={<Icon type="howToReg" />}
          />
          <Button
            onClick={() => setShowUserDialog(false)}
            label={<T id="ImpersonateNotification.followLater" />}
            size="small"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default UserImpersonateNotificationDialog;
