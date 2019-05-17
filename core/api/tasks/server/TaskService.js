import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import CollectionService from '../../helpers/CollectionService';
import { TASK_STATUS, TASK_TYPE } from '../taskConstants';
import { validateTask } from '../taskValidation';
import Tasks from '../tasks';

class TaskService extends CollectionService {
  constructor() {
    super(Tasks);
  }

  insert = ({
    type = TASK_TYPE.CUSTOM,
    fileKey,
    userId,
    assignedTo,
    assignedEmployeeId,
    createdBy,
    title,
    docId,
    collection,
    status,
    dueAt,
  }) => {
    let assignee = assignedTo || assignedEmployeeId;
    if (!assignee && docId && collection) {
      assignee = this.getAssigneeForDoc(docId, collection);
    }

    const taskId = Tasks.insert({
      type,
      assignedEmployeeId: assignee,
      createdBy,
      fileKey,
      userId,
      title,
      docId,
      status,
      dueAt,
    });

    return taskId;
  };

  remove = ({ taskId }) => Tasks.remove(taskId);

  update = ({ taskId, object }) => Tasks.update(taskId, { $set: object });

  getTaskById = taskId => Tasks.findOne(taskId);

  getTasksForDoc = docId => Tasks.find({ docId }).fetch();

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
    this.update({
      taskId,
      object: {
        status: newStatus,
        completedAt:
          newStatus === TASK_STATUS.COMPLETED ? new Date() : undefined,
      },
    });

  changeAssignedTo = ({ taskId, newAssigneeId }) =>
    this.update({ taskId, object: { assignedEmployeeId: newAssigneeId } });

  getAssigneeForDoc = (docId, collection) => {
    const doc = Mongo.Collection.get(collection)
      .createQuery({ $filters: { _id: docId }, assignee: 1 })
      .fetchOne();

    return doc && doc.assignee ? doc.assignee._id : null;
  };
}

export default new TaskService();
