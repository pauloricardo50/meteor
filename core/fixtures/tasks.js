import TaskService from 'core/api/tasks/TaskService';
import { TASK_TYPE } from 'core/api/tasks/tasksConstants';

const types = Object.values(TASK_TYPE);
// const taskService = new TaskService();

export default (loanId, assignedTo) => {
  const type = types[Math.floor(Math.random() * types.length)];

  return TaskService.insert({
    type,
    loanId,
    assignedTo,
    // createdByUserId: Meteor.userId(),
  });
};
