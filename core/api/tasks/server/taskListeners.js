import { USER_EVENTS } from 'core/api/users/userConstants';
import EventService from '../../events';
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

EventService.addMethodListener(requestLoanVerification, ({ loanId }) => {
  const type = TASK_TYPE.VERIFY;
  TaskService.insert({ type, loanId });
});

EventService.addMethodListener(startAuction, (params) => {
  const { loanId } = params;
  const type = TASK_TYPE.AUCTION;
  TaskService.insert({ type, loanId });
});

EventService.addMethodListener(endAuction, ({ loanId }) => {
  const type = TASK_TYPE.AUCTION;
  TaskService.completeTaskByType({ type, loanId });
});

EventService.addMethodListener(cancelAuction, ({ loanId }) => {
  const type = TASK_TYPE.AUCTION;
  TaskService.completeTaskByType({
    type,
    loanId,
    newStatus: TASK_STATUS.CANCELLED,
  });
});

EventService.addMethodListener(assignAdminToNewUser, ({ adminId, userId }) => {
  completeAddAssignedToTask.run({ userId });
  TaskService.assignAllTasksToAdmin({ userId, newAssignee: adminId });
});

export const insertTaskWhenFileAdded = ({
  collection,
  docId,
  documentId,
  file: { key: fileKey },
  userId,
}) => {
  TaskService.insertTaskForAddedFile({
    collection,
    docId,
    documentId,
    fileKey,
    userId,
  });
};
EventService.addMethodListener(addFileToDoc, insertTaskWhenFileAdded);

export const completeTaskOnFileVerification = ({
  collection,
  docId,
  documentId,
  fileKey,
}) => {
  TaskService.completeFileTask({ collection, docId, documentId, fileKey });
};
EventService.addMethodListener(setFileStatus, completeTaskOnFileVerification);

EventService.addListener(USER_EVENTS.USER_CREATED, ({ userId }) => {
  const type = TASK_TYPE.ADD_ASSIGNED_TO;
  TaskService.insert({ type, userId });
});
