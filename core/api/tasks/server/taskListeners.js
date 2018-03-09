import { USER_EVENTS } from 'core/api/users/userConstants';
import EventService from '../../events';
import { mutations } from '../../mutations';
import TaskService from '../TaskService';
import { TASK_TYPE } from '../taskConstants';

EventService.addMutationListener(mutations.LOAN_DELETE, (params) => {
  // TODO: remove parent loan for these tasks
});

EventService.addMutationListener(
  mutations.REQUEST_LOAN_VERIFICATION,
  (params) => {
    // TODO: ADMIN_ACTION_TYPE.VERIFY
  },
);

EventService.addMutationListener(mutations.START_AUCTION, (params) => {
  // TODO: ADMIN_ACTION_TYPE.AUCTION
});

EventService.addMutationListener(mutations.END_AUCTION, (params) => {
  // TODO: complete auction task
});

EventService.addMutationListener(mutations.CANCEL_AUCTION, (params) => {
  // TODO: remove auction task
});

EventService.addMutationListener(mutations.ASSIGN_ADMIN_TO_USER, (params) => {
  // TODO: reassign all tasks created by user
  const { adminId, userId } = params;
  TaskService.assignAllTasksToAdmin({ userId, newAssignee: adminId });
});

EventService.addListener(USER_EVENTS.USER_CREATED, (params) => {
  const { userId } = params;
  const type = TASK_TYPE.ADD_ASSIGNED_TO;
  TaskService.insert({ type, userId });
});
