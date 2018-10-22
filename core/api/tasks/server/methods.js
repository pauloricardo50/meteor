import SecurityService from '../../security';
import TaskService from '../TaskService';
import {
  taskInsert,
  taskUpdate,
  taskComplete,
  taskCompleteByType,
  taskChangeStatus,
  setAssigneeOfTask,
  loanTaskInsert,
} from '../methodDefinitions';
import { TASK_TYPE } from '../taskConstants';

taskInsert.setHandler((context, { type }) => {
  SecurityService.tasks.isAllowedToInsert();
  return TaskService.insert({ type });
});

taskUpdate.setHandler((context, { taskId, object }) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.insert({ taskId, object });
});

taskComplete.setHandler((context, { taskId }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.complete({ taskId });
});

taskCompleteByType.setHandler((context, { type, loanId, newStatus }) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.completeByType({ type, loanId, newStatus });
});

taskChangeStatus.setHandler((context, { taskId, newStatus }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeStatus({ taskId, newStatus });
});

setAssigneeOfTask.setHandler((context, { taskId, newAssigneeId }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeAssignedTo({ taskId, newAssigneeId });
});

loanTaskInsert.setHandler((context, { loanId, title }) => {
  SecurityService.tasks.isAllowedToInsert();
  const task = { type: TASK_TYPE.CUSTOM, loanId, title };

  return TaskService.insert(task);
});
