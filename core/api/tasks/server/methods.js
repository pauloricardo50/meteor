import SecurityService from '../../security';
import TaskService from './TaskService';
import {
  taskInsert,
  taskUpdate,
  taskComplete,
  taskCompleteByType,
  taskChangeStatus,
  setAssigneeOfTask,
} from '../methodDefinitions';

taskInsert.setHandler(({ userId }, params) => {
  SecurityService.tasks.isAllowedToInsert(userId);
  return TaskService.insert(params);
});

taskUpdate.setHandler(({ userId }, params) => {
  SecurityService.tasks.isAllowedToUpdate(userId);
  return TaskService.update(params);
});

taskComplete.setHandler(({ userId }, params) => {
  SecurityService.tasks.isAllowedToUpdate(userId);
  return TaskService.complete(params);
});

taskCompleteByType.setHandler(({ userId }, params) => {
  SecurityService.tasks.isAllowedToUpdate(userId);
  return TaskService.completeTaskByType(params);
});

taskChangeStatus.setHandler(({ userId }, params) => {
  SecurityService.tasks.isAllowedToUpdate(userId);
  return TaskService.changeStatus(params);
});

setAssigneeOfTask.setHandler(({ userId }, params) => {
  SecurityService.tasks.isAllowedToUpdate(userId);
  return TaskService.changeAssignedTo(params);
});
