import { SecurityService } from '../..';
import TaskService from '../TaskService';
import {
  taskInsert,
  taskUpdate,
  taskComplete,
  taskCompleteByType,
  taskChangeStatus,
  taskChangeAssignedTo,
  taskGetRelatedTo,
} from '../methodDefinitions';

taskInsert.setHandler(({ type }) => {
  SecurityService.tasks.isAllowedToInsert();
  return TaskService.insert({ type });
});

taskUpdate.setHandler(({ taskId, task }) => {
  SecurityService.tasks.isAllowedToUpdate();
  return TaskService.insert({ taskId, task });
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

taskChangeAssignedTo.setHandler(({ taskId, newAssignee }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeAssignedTo({ taskId, newAssignee });
});

taskGetRelatedTo.setHandler(({ task }) => {
  SecurityService.tasks.isAllowedToUpdate(task._id);
  return TaskService.getRelatedTo({ task });
});
