import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import rateLimit from '../../../utils/rate-limit.js';

import AdminActions from '../adminActions';
import { ADMIN_ACTION_STATUS } from '../adminActionConstants';

export const insertAdminAction = new ValidatedMethod({
  name: 'insertAdminAction',
  mixins: [CallPromiseMixin],
  validate({ loanId, type }) {
    check(loanId, String);
    check(type, String);
  },
  run({ loanId, type }) {
    // Make sure there isn't an action active with the same ID
    const existingAction = AdminActions.findOne({
      type,
      loanId,
      status: ADMIN_ACTION_STATUS.ACTIVE,
    });
    if (existingAction) {
      throw new Meteor.Error('duplicate active admin action');
    }

    return AdminActions.insert({ type, loanId });
  },
});

export const completeAction = new ValidatedMethod({
  name: 'completeAction',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    const action = AdminActions.findOne(id);

    if (action.status === ADMIN_ACTION_STATUS.COMPLETED) {
      throw new Meteor.Error('action is already completed');
    }

    return AdminActions.update(id, {
      $set: {
        status: ADMIN_ACTION_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });
  },
});

export const completeActionByType = new ValidatedMethod({
  name: 'completeActionByType',
  mixins: [CallPromiseMixin],
  validate({ loanId, type, newStatus }) {
    check(loanId, String);
    check(type, String);
    check(newStatus, Match.Optional(String));
  },
  run({ loanId, type, newStatus }) {
    const action = AdminActions.findOne({
      loanId,
      type,
      status: ADMIN_ACTION_STATUS.ACTIVE,
    });

    if (!action) {
      throw new Meteor.Error("action couldn't be found");
    }

    return AdminActions.update(action._id, {
      $set: {
        status: newStatus || ADMIN_ACTION_STATUS.COMPLETED,
        completedAt: new Date(),
      },
    });
  },
});

export const removeParentLoan = new ValidatedMethod({
  name: 'removeParentLoan',
  mixins: [CallPromiseMixin],
  validate({ loanId }) {
    check(loanId, String);
  },
  run({ loanId }) {
    return AdminActions.update(
      { loanId },
      { $set: { status: ADMIN_ACTION_STATUS.PARENT_DELETED } },
      { multi: true },
    );
  },
});

rateLimit({ methods: [insertAdminAction, completeAction] });
