import { SecurityService, Tasks } from '../..';
import TaskService from '../TaskService';
import {
  taskInsert,
  taskUpdate,
  taskComplete,
  taskCompleteByType,
  taskChangeStatus,
  taskChangeAssignedTo,
  taskGetRelatedTo,
  completeTaskAddAssignedTo,
} from '../methodDefinitions';
import { TASK_STATUS, TASK_TYPE } from '../../constants';

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

completeTaskAddAssignedTo.setHandler((context, { userId }) => {
  const addAssignToTaskId = Tasks.findOne({
    type: TASK_TYPE.ADD_ASSIGNED_TO,
    userId,
  })._id;

  return taskChangeStatus.run({
    taskId: addAssignToTaskId,
    newStatus: TASK_STATUS.COMPLETED,
  });
});
