import { USER_EVENTS } from 'core/api/users/userConstants';
import EventService from '../../events';
import {
  requestLoanVerification,
  startAuction,
  endAuction,
  cancelAuction,
  assignAdminToUser,
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

EventService.addMethodListener(assignAdminToUser, ({ adminId, userId }) => {
  TaskService.assignAllTasksToAdmin({ userId, newAssignee: adminId });
});

EventService.addListener(USER_EVENTS.USER_CREATED, ({ userId }) => {
  const type = TASK_TYPE.ADD_ASSIGNED_TO;
  TaskService.insert({ type, userId });
});
