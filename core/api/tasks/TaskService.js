import { Meteor } from 'meteor/meteor';
import { Borrowers, Loans, Properties, Tasks } from 'core/api';
import { TASK_STATUS, TASK_TYPE } from './tasksConstants';
import unassignedTasksQuery from 'core/api/tasks/queries/tasksUnassigned';
import { truncateSync } from 'fs';

class TaskService {
  insert = ({
    type,
    borrowerId,
    loanId,
    propertyId,
    assignedTo,
    createdBy,
  }) => {
    if (type !== TASK_TYPE.ADD_ASSIGNED_TO) {
      const existingTask = Tasks.findOne({
        type,
        borrowerId,
        loanId,
        propertyId,
        status: TASK_STATUS.ACTIVE,
      });
      if (existingTask) {
        throw new Meteor.Error('duplicate active task');
      }
    }

    let relatedAssignedTo = assignedTo;
    if (!relatedAssignedTo) {
      relatedAssignedTo = this.getRelatedDocAssignedTo({
        borrowerId,
        loanId,
        propertyId,
      });
    }

    return Tasks.insert({
      type,
      assignedTo: relatedAssignedTo,
      createdBy,
      borrowerId,
      loanId,
      propertyId,
    });
  };

  insertUserTask = ({ type, userId }) => {
    if (type !== TASK_TYPE.ADD_ASSIGNED_TO) {
      return undefined;
    }

    return Tasks.insert({
      type,
      userId,
    });
  };

  getRelatedDocAssignedTo = ({ borrowerId, loanId, propertyId }) => {
    if (loanId) {
      return Loans.findOne(loanId).assignedTo;
    }
    if (borrowerId) {
      return Borrowers.findOne(borrowerId).assignedTo;
    }
    if (propertyId) {
      return Properties.findOne(propertyId).assignedTo;
    }
    return undefined;
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

  changeAssignedTo = ({ taskId, newAssignee }) =>
    this.update({
      taskId,
      task: { assignedTo: newAssignee },
    });

  isRelatedToUser = ({ task, userId }) => {
    if (task.userId) {
      return true;
    }
    if (task.borrower && task.borrower.borrowerAssignee === userId) {
      return true;
    }
    if (task.loan && task.loan.user._id === userId) {
      return true;
    }
    if (task.property && task.property.propertyAssignee === userId) {
      return true;
    }
    return false;
  };

  getRelatedTo = ({ task }) => {
    if (task.borrower) {
      return task.borrower.borrowerAssignee;
    }
    if (task.loan) {
      return task.loan.user._id;
    }
    if (task.property) {
      return task.property.propertyAssignee;
    }
    return undefined;
  };

  assignAllTasksToAdmin = ({ userId, newAssignee }) => {
    const unassignedTasks = unassignedTasksQuery.fetch();
    unassignedTasks.map((task) => {
      const isRelatedToUser = this.isRelatedToUser({ task, userId });
      if (isRelatedToUser) {
        const taskId = task._id;
        this.update({
          taskId,
          task: { assignedTo: newAssignee },
        });
      }

      return task;
    });
  };
}

export default new TaskService();
