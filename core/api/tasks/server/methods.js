import SecurityService from '../../security';
import {
  proAddLoanTask,
  setAssigneeOfTask,
  taskChangeStatus,
  taskComplete,
  taskInsert,
  taskUpdate,
} from '../methodDefinitions';
import TaskService from './TaskService';

taskInsert.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return TaskService.insert(params);
});

taskUpdate.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return TaskService.update(params);
});

taskComplete.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return TaskService.complete(params);
});

taskChangeStatus.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return TaskService.changeStatus(params);
});

setAssigneeOfTask.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return TaskService.changeAssignedTo(params);
});

proAddLoanTask.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  // Should probably check that this pro has access to this loan
  // Not doing this, because this is a method called by our partners
  // There's no security risk to let this happen
  return TaskService.proAddLoanTask({ userId, ...params });
});
