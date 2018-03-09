import { SecurityService } from '../..';
import TaskService from '../TaskService';
import {
  taskInsert,
  taskUpdate,
  taskComplete,
  taskCompleteByType,
  taskChangeStatus,
  taskChangeUser,
} from '../methodDefinitions';

taskInsert.setHandler(({ type, loanId }) => {
  SecurityService.tasks.isAllowedToInsert();
  return TaskService.insert({ type, loanId });
});

taskUpdate.setHandler(({ taskId, object }) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.insert({ taskId, object });
});

taskComplete.setHandler(({ taskId }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.complete({ taskId });
});

taskCompleteByType.setHandler(({ type, loanId, newStatus }) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.completeByType({ type, loanId, newStatus });
});

taskChangeStatus.setHandler(({ taskId, newStatus }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeStatus({ taskId, newStatus });
});

taskChangeUser.setHandler(({ taskId, newUser }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeUser({ taskId, newUser });
});
