import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import moment from 'moment';

import { CONTACTS_COLLECTION } from '../../contacts/contactsConstants';
import { task as taskFragment } from '../../fragments';
import { getUserNameAndOrganisation } from '../../helpers';
import CollectionService from '../../helpers/server/CollectionService';
import { INSURANCE_REQUESTS_COLLECTION } from '../../insuranceRequests/insuranceRequestConstants';
import { LENDERS_COLLECTION } from '../../lenders/lenderConstants';
import { LOANS_COLLECTION } from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';
import { ORGANISATIONS_COLLECTION } from '../../organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';
import UserService from '../../users/server/UserService';
import { USERS_COLLECTION } from '../../users/userConstants';
import { TASK_STATUS } from '../taskConstants';
import Tasks from '../tasks';

class TaskService extends CollectionService {
  constructor() {
    super(Tasks);
  }

  insert({
    object: { collection, dueAt, dueAtTime, docId, assigneeLink = {}, ...rest },
  }) {
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
    if (collection === INSURANCE_REQUESTS_COLLECTION) {
      this.addLink({ id: taskId, linkName: 'insuranceRequest', linkId: docId });
    }
    if (assignee) {
      this.addLink({ id: taskId, linkName: 'assignee', linkId: assignee });
    }

    return taskId;
  }

  remove({ taskId }) {
    return Tasks.remove(taskId);
  }

  update({ taskId, object }) {
    return Tasks.update(taskId, { $set: object });
  }

  getTaskById(taskId) {
    return this.get(taskId, taskFragment());
  }

  getTasksForDoc(docId) {
    return Tasks.find({ docId }).fetch();
  }

  getDueDate({ dueAt, dueAtTime }) {
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
  }

  complete({ taskId }) {
    return this.update({
      taskId,
      object: { status: TASK_STATUS.COMPLETED, completedAt: new Date() },
    });
  }

  changeStatus({ taskId, newStatus }) {
    return this.update({
      taskId,
      object: {
        status: newStatus,
        completedAt:
          newStatus === TASK_STATUS.COMPLETED ? new Date() : undefined,
      },
    });
  }

  changeAssignedTo({ taskId, newAssigneeId }) {
    this.addLink({ id: taskId, linkName: 'assignee', linkId: newAssigneeId });
  }

  getAssigneeForDoc(docId, collection) {
    if (collection === LOANS_COLLECTION) {
      const mainAssignee = LoanService.getMainAssignee({ loanId: docId });
      if (mainAssignee) {
        return mainAssignee?._id;
      }
    }

    let fragment = { assignee: 1 };

    if (collection === ORGANISATIONS_COLLECTION) {
      fragment = { assignee: { _id: 1 } };
    }

    const doc = Mongo.Collection.get(collection)
      .createQuery({ $filters: { _id: docId }, ...fragment })
      .fetchOne();

    return doc?.assignee?._id;
  }

  proAddLoanTask({ userId, loanId, note }) {
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
  }

  snooze({ taskId, workingDays }) {
    const { dueAt } = this.get(taskId, { dueAt: 1 });
    const isInPast = dueAt && dueAt.getTime() < new Date().getTime();
    const dateToStartFrom = moment(isInPast ? undefined : dueAt);
    let daysRemaining = workingDays;

    while (daysRemaining > 0) {
      dateToStartFrom.add(1, 'days');

      if (dateToStartFrom.day() !== 0 && dateToStartFrom.day() !== 6) {
        daysRemaining -= 1;
      }
    }

    return this.update({
      taskId,
      object: {
        dueAt: dateToStartFrom
          .hours(8)
          .minutes(0)
          .seconds(0)
          .milliseconds(0)
          .toDate(),
      },
    });
  }
}

export default new TaskService();
