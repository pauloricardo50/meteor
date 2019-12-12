import SecurityService from '../../security';
import TaskService from './TaskService';
import {
  taskInsert,
  taskUpdate,
  taskComplete,
  taskChangeStatus,
  setAssigneeOfTask,
  proAddLoanTask,
} from '../methodDefinitions';

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
  // Should check that this pro has access to this loan
  return TaskService.proAddLoanTask({ userId, ...params });
});
