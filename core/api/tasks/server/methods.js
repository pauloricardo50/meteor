import SecurityService from '../../security';
import TaskService from './TaskService';
import {
  taskInsert,
  taskUpdate,
  taskComplete,
  taskChangeStatus,
  setAssigneeOfTask,
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
