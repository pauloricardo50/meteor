import { Mongo } from 'meteor/mongo';

import { LOANS_COLLECTION, USERS_COLLECTION } from '../../constants';
import CollectionService from '../../helpers/CollectionService';
import { TASK_STATUS } from '../taskConstants';
import Tasks from '../tasks';

class TaskService extends CollectionService {
  constructor() {
    super(Tasks);
  }

  insert = ({
    object: {
      assignedTo,
      assigneeId,
      createdBy,
      title,
      collection,
      status,
      dueAt,
      docId,
      ...rest
    },
  }) => {
    let assignee = assignedTo || assigneeId;
    if (!assignee && docId && collection) {
      assignee = this.getAssigneeForDoc(docId, collection);
    }

    const taskId = Tasks.insert({
      createdBy,
      title,
      status,
      dueAt,
      ...rest,
    });

    if (collection === LOANS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'loan', linkId: docId });
    }
    if (collection === USERS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'user', linkId: docId });
    }

    if (assignee) {
      this.addLink({ id: taskId, linkName: 'assignee', linkId: assignee });
    }

    return taskId;
  };

  remove = ({ taskId }) => Tasks.remove(taskId);

  update = ({ taskId, object }) => Tasks.update(taskId, { $set: object });

  getTaskById = taskId => Tasks.findOne(taskId);

  getTasksForDoc = docId => Tasks.find({ docId }).fetch();

  complete = ({ taskId }) =>
    this.update({
      taskId,
      object: { status: TASK_STATUS.COMPLETED, completedAt: new Date() },
    });

  changeStatus = ({ taskId, newStatus }) =>
    this.update({
      taskId,
      object: {
        status: newStatus,
        completedAt:
          newStatus === TASK_STATUS.COMPLETED ? new Date() : undefined,
      },
    });

  changeAssignedTo = ({ taskId, newAssigneeId }) => {
    this.addLink({ id: taskId, linkName: 'assignee', linkId: newAssigneeId });
  };

  getAssigneeForDoc = (docId, collection) => {
    const doc = Mongo.Collection.get(collection)
      .createQuery({ $filters: { _id: docId }, assignee: 1 })
      .fetchOne();

    return doc && doc.assignee ? doc.assignee._id : null;
  };
}

export default new TaskService();
