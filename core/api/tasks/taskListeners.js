import { ClientEventService } from '../events';
import { setFileStatus, assignAdminToNewUser } from '../methods';
import TasksNotificationService from './TasksNotificationService';

export const fileStatusChangedTaskNotificationListener = ({
  fileKey,
  newStatus,
}) => {
  TasksNotificationService.notifyTaskCompletedWhenFileStatusChanged({
    fileKey,
    newStatus,
  });
};

ClientEventService.addMethodListener(
  setFileStatus,
  fileStatusChangedTaskNotificationListener,
);

export const adminAssignedTaskNotificationListener = ({ userId }) => {
  TasksNotificationService.notifyTaskCompletedWhenAdminAssignedToNewUser({
    userId,
  });
};

ClientEventService.addMethodListener(
  assignAdminToNewUser,
  adminAssignedTaskNotificationListener,
);
