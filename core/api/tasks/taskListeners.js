import { ClientEventService } from '../events';
import { setFileStatus, completeAddAssignedToTask } from '../methods';
import TasksNotificationService from './TasksNotificationService';

export const notifyAdminOfCompletedTaskOnFileStatusChangedListener = ({
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
  notifyAdminOfCompletedTaskOnFileStatusChangedListener,
);

export const notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener = ({
  userId,
}) => {
  TasksNotificationService.notifyTaskCompletedWhenAdminAssignedToTask({
    userId,
  });
};

ClientEventService.addMethodListener(
  completeAddAssignedToTask,
  notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener,
);
