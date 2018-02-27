import { SecurityService, createMutator } from '../..';
import TaskService from '../TaskService';
import * as defs from '../mutationDefinitions';

createMutator(defs.TASK_INSERT, ({ type, loanId }) => {
  SecurityService.tasks.isAllowedToInsert();
  return TaskService.insert({ type, loanId });
});

createMutator(defs.TASK_UPDATE, ({ taskId, object }) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.insert({ taskId, object });
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

createMutator(defs.TASK_CHANGE_USER, ({ taskId, newUser }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeUser({ taskId, newUser });
});
