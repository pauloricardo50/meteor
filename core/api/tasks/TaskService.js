import { Meteor } from 'meteor/meteor';
import Tasks from '../tasks';
import { TASK_STATUS } from './tasksConstants';

class TaskService {
  insert = ({ type, loanId, assignedTo, createdBy }) => {
    const existingTask = Tasks.findOne({
      type,
      loanId,
      status: TASK_STATUS.ACTIVE,
    });

    if (existingTask) {
      throw new Meteor.Error('duplicate active task');
    }

    return Tasks.insert({
      type,
      loanId,
      assignedTo,
      createdBy,
    });
  };

  remove = ({ taskId }) => Tasks.remove(taskId);

  update = ({ taskId, task }) => Tasks.update(taskId, { $set: task });

  complete = ({ taskId }) =>
    this.update({
      taskId,
      task: {
        status: TASK_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });

  completeByType = ({ type, loanId, newStatus }) => {
    const taskToComplete = Tasks.findOne({
      loanId,
      type,
      status: TASK_STATUS.ACTIVE,
    });

    if (!taskToComplete) {
      throw new Meteor.Error("task couldn't be found");
    }

    return this.update({
      taskId: taskToComplete._id,
      task: {
        status: newStatus || TASK_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });
  };

  changeStatus = ({ taskId, newStatus }) =>
    this.update({ taskId, task: { status: newStatus } });

  changeUser = ({ taskId, newUser }) =>
    this.update({
      taskId,
      task: { userId: newUser },
    });
}

export default new TaskService();
