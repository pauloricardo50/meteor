import { USER_EVENTS } from 'core/api/users/userConstants';
import ServerEventService from '../../events/server/ServerEventService';
import {
  requestLoanVerification,
  startAuction,
  endAuction,
  cancelAuction,
  assignAdminToNewUser,
  completeAddAssignedToTask,
  addFileToDoc,
  setFileStatus,
} from '../../methods';
import TaskService from '../TaskService';
import { TASK_TYPE, TASK_STATUS } from '../taskConstants';

ServerEventService.addMethodListener(requestLoanVerification, ({ loanId }) => {
  const type = TASK_TYPE.VERIFY;
  TaskService.insert({ type, loanId });
});

ServerEventService.addMethodListener(startAuction, (params) => {
  const { loanId } = params;
  const type = TASK_TYPE.AUCTION;
  TaskService.insert({ type, loanId });
});

ServerEventService.addMethodListener(endAuction, ({ loanId }) => {
  const type = TASK_TYPE.AUCTION;
  TaskService.completeTaskByType({ type, loanId });
});

ServerEventService.addMethodListener(cancelAuction, ({ loanId }) => {
  const type = TASK_TYPE.AUCTION;
  TaskService.completeTaskByType({
    type,
    loanId,
    newStatus: TASK_STATUS.CANCELLED,
  });
});

ServerEventService.addMethodListener(
  assignAdminToNewUser,
  ({ adminId, userId }) => {
    completeAddAssignedToTask.run({ userId });
    TaskService.assignAllTasksToAdmin({ userId, newAssignee: adminId });
  },
);

export const insertTaskWhenFileAddedListener = ({
  collection,
  docId,
  documentId,
  file: { key: fileKey },
  userId,
}) =>
  TaskService.insertTaskForAddedFile({
    collection,
    docId,
    documentId,
    fileKey,
    userId,
  });

ServerEventService.addMethodListener(
  addFileToDoc,
  insertTaskWhenFileAddedListener,
);

export const completeTaskOnFileVerificationListener = ({
  collection,
  docId,
  documentId,
  fileKey,
}) => TaskService.completeFileTask({ collection, docId, documentId, fileKey });

ServerEventService.addMethodListener(
  setFileStatus,
  completeTaskOnFileVerificationListener,
);

ServerEventService.addListener(USER_EVENTS.USER_CREATED, ({ userId }) => {
  const type = TASK_TYPE.ADD_ASSIGNED_TO;
  TaskService.insert({ type, userId });
});
