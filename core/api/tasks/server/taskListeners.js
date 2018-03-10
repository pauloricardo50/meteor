import { USER_EVENTS } from 'core/api/users/userConstants';
import EventService from '../../events';
import {
  loanDelete,
  requestLoanVerification,
  startAuction,
  endAuction,
  cancelAuction,
  assignAdminToUser,
} from '../../methods';
import TaskService from '../TaskService';
import { TASK_TYPE } from '../taskConstants';

EventService.addMethodListener(loanDelete, (params) => {
  // TODO: remove parent loan for these tasks
});

EventService.addMethodListener(requestLoanVerification, (params) => {
  // TODO: ADMIN_ACTION_TYPE.VERIFY
});

EventService.addMethodListener(startAuction, (params) => {
  // TODO: ADMIN_ACTION_TYPE.AUCTION
});

EventService.addMethodListener(endAuction, (params) => {
  // TODO: complete auction task
});

EventService.addMethodListener(cancelAuction, (params) => {
  // TODO: remove auction task
});

EventService.addMethodListener(assignAdminToUser, (params) => {
  // TODO: reassign all tasks created by user
  const { adminId, userId } = params;
  TaskService.assignAllTasksToAdmin({ userId, newAssignee: adminId });
});

EventService.addListener(USER_EVENTS.USER_CREATED, (params) => {
  const { userId } = params;
  const type = TASK_TYPE.ADD_ASSIGNED_TO;
  TaskService.insert({ type, userId });
});
