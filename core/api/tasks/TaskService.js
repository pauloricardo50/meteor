import { Meteor } from 'meteor/meteor';

import UserService from '../users/UserService';
import SlackService from '../slack/SlackService';
import CollectionService from '../helpers/CollectionService';
import { TASK_STATUS } from './taskConstants';
import { validateTask } from './taskValidation';
import Tasks from '.';

class TaskService extends CollectionService {
  constructor() {
    super(Tasks);
  }

  insert = ({ type, fileKey, userId, assignedTo, createdBy, title }) => {
    const taskId = Tasks.insert({
      type,
      assignedEmployeeId: assignedTo,
      createdBy,
      fileKey,
      userId,
      title,
    });

    const user = UserService.get(Meteor.userId());
    SlackService.notifyOfTask(user);
    return taskId;
  };

  remove = ({ taskId }) => Tasks.remove(taskId);

  update = ({ taskId, object }) => Tasks.update(taskId, { $set: object });

  getTaskById = taskId => Tasks.findOne(taskId);

  complete = ({ taskId }) => {
    const task = this.getTaskById(taskId);
    if (!validateTask(task)) {
      throw new Meteor.Error('incomplete-task');
    }

    return this.update({
      taskId,
      object: {
        status: TASK_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });
  };

  completeTaskByType = ({
    type,
    loanId,
    newStatus = TASK_STATUS.COMPLETED,
  }) => {
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
      object: {
        status: newStatus,
        completedAt: new Date(),
      },
    });
  };

  changeStatus = ({ taskId, newStatus }) =>
    this.update({ taskId, object: { status: newStatus } });

  changeAssignedTo = ({ taskId, newAssignee }) =>
    this.update({ taskId, object: { assignedEmployeeId: newAssignee } });
}

export default new TaskService();
