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

taskChangeAssignedTo.setHandler((context, { taskId, newAssignee }) => {
  SecurityService.tasks.isAllowedToUpdate(taskId);
  return TaskService.changeAssignedTo({ taskId, newAssignee });
});

taskGetRelatedTo.setHandler((context, { task }) => {
  SecurityService.tasks.isAllowedToUpdate(task._id);
  return TaskService.getRelatedTo({ task });
});
