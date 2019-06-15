import { Mongo } from 'meteor/mongo';

import moment from 'moment';

import { LOANS_COLLECTION, USERS_COLLECTION } from '../../constants';
import CollectionService from '../../helpers/CollectionService';
import { TASK_STATUS } from '../taskConstants';
import Tasks from '../tasks';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';
import { ORGANISATIONS_COLLECTION } from '../../organisations/organisationConstants';
import { LENDERS_COLLECTION } from '../../lenders/lenderConstants';

class TaskService extends CollectionService {
  constructor() {
    super(Tasks);
  }

  insert = ({
    object: {
      assigneeId,
      title,
      collection,
      status,
      dueAt,
      dueAtTime,
      docId,
      ...rest
    },
  }) => {
    let assignee;
    if (!assigneeId && docId && collection) {
      assignee = this.getAssigneeForDoc(docId, collection);
    }

    const taskId = Tasks.insert({
      title,
      status,
      dueAt: this.getDueDate({ dueAt, dueAtTime }),
      ...rest,
    });

    if (collection === LOANS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'loan', linkId: docId });
    }
    if (collection === USERS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'user', linkId: docId });
    }
    if (collection === PROMOTIONS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'promotion', linkId: docId });
    }
    if (collection === ORGANISATIONS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'organisation', linkId: docId });
    }
    if (collection === LENDERS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'lender', linkId: docId });
    }

    if (assigneeId || assignee) {
      this.addLink({
        id: taskId,
        linkName: 'assignee',
        linkId: assigneeId || assignee,
      });
    }

    return taskId;
  };

  remove = ({ taskId }) => Tasks.remove(taskId);

  update = ({ taskId, object }) => Tasks.update(taskId, { $set: object });

  getTaskById = taskId => Tasks.findOne(taskId);

  getTasksForDoc = docId => Tasks.find({ docId }).fetch();

  getDueDate = ({ dueAt, dueAtTime }) => {
    if (dueAt) {
      return dueAt;
    }

    if (dueAtTime) {
      const date = moment(dueAtTime, 'HH:mm');
      if (moment().isAfter(date)) {
        // If it is 14:00, and you choose 10:00 as the time, you don't want it
        // in the past, but tomorrow
        date.add(1, 'd');
      }
      return date.toDate();
    }
  };

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
