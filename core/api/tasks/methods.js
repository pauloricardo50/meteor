import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import rateLimit from '../../utils/rate-limit.js';

import Tasks from './tasks';
import { TASK_STATUS } from './tasksConstants';

export const insertTask = new ValidatedMethod({
  name: 'tasks.insert',
  mixins: [CallPromiseMixin],
  validate({ loanId, type }) {
    check(loanId, String);
    check(type, String);
  },
  run({ loanId, type }) {
    // Make sure there isn't an action active with the same ID
    const existingAction = Tasks.findOne({
      type,
      loanId,
      status: TASK_STATUS.ACTIVE,
    });
    if (existingAction) {
      throw new Meteor.Error('duplicate active admin action');
    }

    return Tasks.insert({ type, loanId });
  },
});

export const completeTask = new ValidatedMethod({
  name: 'tasks.complete',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    const action = Tasks.findOne(id);

    if (action.status === TASK_STATUS.COMPLETED) {
      throw new Meteor.Error('action is already completed');
    }

    return Tasks.update(id, {
      $set: {
        status: TASK_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });
  },
});

export const completeTaskByType = new ValidatedMethod({
  name: 'tasks.completeTaskByType',
  mixins: [CallPromiseMixin],
  validate({ loanId, type, newStatus }) {
    check(loanId, String);
    check(type, String);
    check(newStatus, Match.Optional(String));
  },
  run({ loanId, type, newStatus }) {
    const action = Tasks.findOne({
      loanId,
      type,
      status: TASK_STATUS.ACTIVE,
    });

    if (!action) {
      throw new Meteor.Error("action couldn't be found");
    }

    return Tasks.update(action._id, {
      $set: {
        status: newStatus || TASK_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });
  },
});

export const changeTaskStatus = new ValidatedMethod({
  name: 'tasks.changeTaskStatus',
  mixins: [CallPromiseMixin],
  validate({ taskId, newStatus }) {
    check(taskId, String);
    check(newStatus, String);
  },
  run({ taskId, newStatus }) {
    if (newStatus != TASK_STATUS.COMPLETED) {
      return Tasks.update(taskId, { $set: { status: newStatus } });
    }
    return Tasks.update(taskId, {
      $set: {
        status: newStatus || TASK_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });

    return true;
  },
});

export const changeTaskUser = new ValidatedMethod({
  name: 'tasks.changeTaskUser',
  mixins: [CallPromiseMixin],
  validate({ taskId, newUser }) {
    check(taskId, String);
    check(newUser, String);
  },
  run({ taskId, newUser }) {
    return Tasks.update(taskId, { $set: { userId: newUser } });
  },
});

rateLimit({ methods: [insertTask, completeTask] });
