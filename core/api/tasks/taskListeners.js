import { ClientEventService } from '../events';
import { setFileStatus, completeAddAssignedToTask } from '../methods';
import TasksNotificationService from './TasksNotificationService';

export const fileStatusChangedCompletedTaskNotificationListener = ({
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
  fileStatusChangedCompletedTaskNotificationListener,
);

export const addAssignedToCompletedTaskNotificationListener = ({ userId }) => {
  TasksNotificationService.notifyTaskCompletedWhenAddedAssignedAdmin({
    userId,
  });
};

ClientEventService.addMethodListener(
  completeAddAssignedToTask,
  addAssignedToCompletedTaskNotificationListener,
);
