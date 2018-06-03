import { Meteor } from 'meteor/meteor';
import { Tasks } from '../';
import unassignedTasksQuery from '../tasks/queries/unassignedTasks';
import borrowerAssignedToQuery from '../borrowers/queries/borrowerAssignedTo';
import loanAssignedToQuery from '../loans/queries/loanAssignedTo';
import propertyAssignedToQuery from '../properties/queries/propertyAssignedTo';
import { TASK_STATUS, TASK_TYPE } from './taskConstants';
import { validateTask } from './taskValidation';
import Users from '../users/users';
import { isUser } from '../../utils/userFunctions';
import { getIdFieldNameFromCollection } from '../helpers/helpers';

class TaskService {
  insert = ({
    type,
    borrowerId,
    loanId,
    propertyId,
    documentId,
    fileKey,
    userId,
    assignedTo,
    createdBy,
  }) => {
    if (type === TASK_TYPE.ADD_ASSIGNED_TO) {
      return Tasks.insert({ type, userId });
    }

    const existingTask = Tasks.findOne({
      type,
      borrowerId,
      loanId,
      propertyId,
      status: TASK_STATUS.ACTIVE,
      documentId,
      fileKey,
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
      assignedEmployeeId: relatedAssignedTo,
      createdBy,
      borrowerId,
      loanId,
      propertyId,
      documentId,
      fileKey,
      userId,
    });
  };

  insertTaskForAddedFile = ({
    collection,
    docId,
    documentId,
    fileKey,
    userId,
  }) => {
    const userWhoAddedTheFile = Users.findOne(userId);
    if (!isUser(userWhoAddedTheFile)) {
      return;
    }

    const type = TASK_TYPE.USER_ADDED_FILE;
    const relatedDocIdFieldName = getIdFieldNameFromCollection(collection);

    this.insert({
      type,
      [relatedDocIdFieldName]: docId,
      documentId,
      fileKey,
      userId,
    });
  };

  getRelatedDocAssignedTo = ({ borrowerId, loanId, propertyId }) => {
    if (loanId) {
      const loans = loanAssignedToQuery.clone({ loanId }).fetchOne();
      return loans.user.assignedEmployeeId;
    }
    if (borrowerId) {
      const borrowers = borrowerAssignedToQuery
        .clone({ borrowerId })
        .fetchOne();
      return borrowers.user.assignedEmployeeId;
    }
    if (propertyId) {
      const properties = propertyAssignedToQuery
        .clone({ propertyId })
        .fetchOne();
      return properties.user.assignedEmployeeId;
    }
    return undefined;
  };

  remove = ({ taskId }) => Tasks.remove(taskId);

  update = ({ taskId, object }) => Tasks.update(taskId, { $set: object });

  complete = ({ taskId }) => {
    const task = Tasks.findOne(taskId);
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
        this.update({
          taskId: task._id,
          object: { assignedEmployeeId: newAssignee },
        });
      }

      return task;
    });
  };
}

export default new TaskService();
