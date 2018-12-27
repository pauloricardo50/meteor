import SecurityService from '../../security';
import TaskService from '../TaskService';
import {
  taskInsert,
  taskUpdate,
  taskComplete,
  taskCompleteByType,
  taskChangeStatus,
  setAssigneeOfTask,
} from '../methodDefinitions';

taskInsert.setHandler((context, params) => {
  SecurityService.tasks.isAllowedToInsert();
  return TaskService.insert(params);
});

taskUpdate.setHandler((context, params) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.update(params);
});

taskComplete.setHandler((context, params) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.complete(params);
});

taskCompleteByType.setHandler((context, params) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.completeTaskByType(params);
});

taskChangeStatus.setHandler((context, params) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.changeStatus(params);
});

setAssigneeOfTask.setHandler((context, params) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.changeAssignedTo(params);
});
