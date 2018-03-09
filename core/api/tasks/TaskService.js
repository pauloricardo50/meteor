import { Meteor } from 'meteor/meteor';
import { Tasks } from '../';
import unassignedTasksQuery from '../tasks/queries/unassignedTasks';
import borrowerAssignedToQuery from '../borrowers/queries/borrowerAssignedTo';
import loanAssignedToQuery from '../loans/queries/loanAssignedTo';
import propertyAssignedToQuery from '../properties/queries/propertyAssignedTo';
import { TASK_STATUS, TASK_TYPE } from './tasksConstants';

class TaskService {
  insert = ({
    type,
    borrowerId,
    loanId,
    propertyId,
    userId,
    assignedTo,
    createdBy,
  }) => {
    if (type === TASK_TYPE.ADD_ASSIGNED_TO) {
      return Tasks.insert({
        type,
        userId,
      });
    }
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

    let relatedAssignedTo = assignedTo;
    if (!relatedAssignedTo) {
      // some tasks may not be related to any doc,
      // in that case no need for assignedTo field
      if (borrowerId || loanId || propertyId) {
        relatedAssignedTo = this.getRelatedDocAssignedTo({
          borrowerId,
          loanId,
          propertyId,
        });
      }
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

  getRelatedDocAssignedTo = ({ borrowerId, loanId, propertyId }) => {
    if (loanId) {
      const loans = loanAssignedToQuery.clone({ loanId }).fetchOne();
      return loans.user.assignedTo;
    }
    if (borrowerId) {
      const borrowers = borrowerAssignedToQuery
        .clone({ borrowerId })
        .fetchOne();
      return borrowers.user.assignedTo;
    }
    if (propertyId) {
      const properties = propertyAssignedToQuery
        .clone({ propertyId })
        .fetchOne();
      return properties.user.assignedTo;
    }
    return undefined;
  };

  remove = ({ taskId }) => Tasks.remove(taskId);

  update = ({ taskId, task }) => Tasks.update(taskId, { $set: task });

  complete = ({ taskId }) => {
    const task = Tasks.findOne(taskId);
    if (!validateTask(task)) {
      throw new Meteor.Error('incomplete-task');
    }

    return this.update({
      taskId,
      task: {
        status: TASK_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });
  };

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
    if (task.userId === userId) {
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
      return task.borrower.user._id;
    }
    if (task.loan) {
      return task.loan.user._id;
    }
    if (task.property) {
      return task.property.user._id;
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
