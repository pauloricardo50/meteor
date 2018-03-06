import { SecurityService, createMutator } from '../..';
import TaskService from '../TaskService';
import * as defs from '../mutationDefinitions';

createMutator(defs.TASK_INSERT, ({ type }) => {
  SecurityService.tasks.isAllowedToInsert();
  return TaskService.insert({ type });
});

createMutator(defs.TASK_UPDATE, ({ taskId, task }) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.insert({ taskId, task });
});

createMutator(defs.TASK_COMPLETE, ({ taskId }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.complete({ taskId });
});

createMutator(defs.TASK_COMPLETE_BY_TYPE, ({ type, loanId, newStatus }) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.completeByType({ type, loanId, newStatus });
});

createMutator(defs.TASK_CHANGE_STATUS, ({ taskId, newStatus }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeStatus({ taskId, newStatus });
});

createMutator(defs.TASK_CHANGE_ASSIGNED_TO, ({ taskId, newAssignee }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeAssignedTo({ taskId, newAssignee });
});

createMutator(defs.TASK_IS_RELATED_TO, ({ task, userId }) => {
  SecurityService.tasks.isAllowedToUpdate(task._id);
  return TaskService.isRelatedTo({ task, userId });
});

createMutator(defs.TASK_GET_RELATED_TO, ({ task }) => {
  SecurityService.tasks.isAllowedToUpdate(task._id);
  return TaskService.getRelatedTo({ task });
});
