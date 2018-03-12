import TaskService from 'core/api/tasks/TaskService';
import { TASK_TYPE } from 'core/api/tasks/taskConstants';

const types = Object.values(TASK_TYPE).filter(item => item !== TASK_TYPE.ADD_ASSIGNED_TO);

const createFakeTasks = (loanId, assignedTo) => {
  const type = types[Math.floor(Math.random() * types.length)];

  return TaskService.insert({
    type,
    loanId,
    assignedEmployeeId: assignedTo,
    // createdByUserId: Meteor.userId(),
  });
};

export default createFakeTasks;
