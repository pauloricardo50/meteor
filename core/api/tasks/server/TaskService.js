import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import moment from 'moment';

import { getUserNameAndOrganisation } from 'core/api/helpers/index';
import { LOANS_COLLECTION, USERS_COLLECTION } from '../../constants';
import CollectionService from '../../helpers/CollectionService';
import { TASK_STATUS } from '../taskConstants';
import Tasks from '../tasks';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';
import { ORGANISATIONS_COLLECTION } from '../../organisations/organisationConstants';
import { LENDERS_COLLECTION } from '../../lenders/lenderConstants';
import { task as taskFragment } from '../../fragments';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import { CONTACTS_COLLECTION } from '../../contacts/contactsConstants';

class TaskService extends CollectionService {
  constructor() {
    super(Tasks);
  }

  insert = ({
    object: { collection, dueAt, dueAtTime, docId, assigneeLink = {}, ...rest },
  }) => {
    let assignee = assigneeLink._id;
    if (!assignee && docId && collection) {
      assignee = this.getAssigneeForDoc(docId, collection);
    }

    const { isPrivate } = rest;

    if (docId && isPrivate) {
      throw new Meteor.Error(
        'Uniquement les tâches orphelines peuvent être privées',
      );
    }

    const taskId = Tasks.insert({
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
    if (collection === CONTACTS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'contact', linkId: docId });
    }

    if (assignee) {
      this.addLink({
        id: taskId,
        linkName: 'assignee',
        linkId: assignee,
      });
    }

    return taskId;
  };

  remove = ({ taskId }) => Tasks.remove(taskId);

  update = ({ taskId, object }) => Tasks.update(taskId, { $set: object });

  getTaskById = taskId => this.get(taskId, taskFragment());

  getTasksForDoc = docId => Tasks.find({ docId }).fetch();

  getDueDate = ({ dueAt, dueAtTime }) => {
    if (dueAt && !dueAtTime) {
      return dueAt;
    }

    if (dueAtTime) {
      const [hours = 0, minutes = 0] = dueAtTime.split(':');
      const date = moment(dueAt || undefined)
        .hour(hours)
        .minute(minutes)
        .seconds(0)
        .milliseconds(0);

      if (dueAt) {
        return date.toDate();
      }

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
    if (collection === LOANS_COLLECTION) {
      const mainAssignee = LoanService.getMainAssignee({ loanId: docId });
      if (mainAssignee) {
        return mainAssignee?._id;
      }
    }

    const doc = Mongo.Collection.get(collection)
      .createQuery({ $filters: { _id: docId }, assignee: 1 })
      .fetchOne();

    return doc?.assignee?._id;
  };

  proAddLoanTask = ({ userId, loanId, note }) => {
    const pro = UserService.get(userId, {
      name: 1,
      organisations: { name: 1 },
    });

    return this.insert({
      object: {
        collection: LOANS_COLLECTION,
        docId: loanId,
        title: `Nouvelle note de ${getUserNameAndOrganisation({ user: pro })}`,
        description: `${note}`,
      },
    });
  };
}

export default new TaskService();
