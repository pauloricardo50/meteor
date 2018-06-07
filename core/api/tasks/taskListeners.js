import { ClientEventService } from '../events';
import { setFileStatus, completeAddAssignedToTask } from '../methods';

export const notifyAdminOfCompletedTaskOnFileStatusChangedListener = ({
  collection,
  docId,
  documentId,
  fileKey,
  newStatus,
}) => {};

ClientEventService.addMethodListener(
  setFileStatus,
  notifyAdminOfCompletedTaskOnFileStatusChangedListener,
);

export const notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener = ({
  userId,
}) => {};

ClientEventService.addMethodListener(
  completeAddAssignedToTask,
  notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener,
);
