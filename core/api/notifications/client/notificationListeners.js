// IMPORTANT NOTE:
//   do not add sensitive information here (such as sensitive alert messages)
//   because this is client code

import { ClientEventService } from '../../events';
import { setFileStatus, assignAdminToNewUser } from '../../methods';
import NotificationService from './NotificationService';
import { FILE_STATUS } from '../../constants';

export const fileVerifiedNotificationListener = ({ newStatus }) => {
  if ([FILE_STATUS.VALID, FILE_STATUS.ERROR].includes(newStatus)) {
    NotificationService.notifyAdmin({
      title: 'Task Completed',
      message: 'Completed task of added file',
    });
  }
};
ClientEventService.addMethodListener(
  setFileStatus,
  fileVerifiedNotificationListener,
);

export const adminAssignedToNewUserNotificationListener = ({ newStatus }) => {
  NotificationService.notifyAdmin({
    title: 'Task Completed',
    message: 'Completed task of admin to user assignment',
  });
};
ClientEventService.addMethodListener(
  assignAdminToNewUser,
  adminAssignedToNewUserNotificationListener,
);
