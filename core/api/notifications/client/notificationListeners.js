// IMPORTANT NOTE:
//   do not add sensitive information here (such as sensitive alert messages)
//   because this is client code

import ClientEventService from '../../events/client/ClientEventService';
import { setFileStatus, assignAdminToNewUser } from '../../methods';
import NotificationService from './NotificationService';
import { FILE_STATUS } from '../../constants';

export const fileVerifiedNotificationListener = ({ newStatus }) => {
  if ([FILE_STATUS.VALID, FILE_STATUS.ERROR].includes(newStatus)) {
    NotificationService.notifyAdmin({
      title: 'Tâche complétée',
      message: 'Document vérifié',
    });
  }
};
ClientEventService.addMethodListener(
  setFileStatus,
  fileVerifiedNotificationListener,
);

export const adminAssignedToNewUserNotificationListener = ({ newStatus }) => {
  NotificationService.notifyAdmin({
    title: 'Tâche complétée',
    message: 'Assigné un admin',
  });
};
ClientEventService.addMethodListener(
  assignAdminToNewUser,
  adminAssignedToNewUserNotificationListener,
);
