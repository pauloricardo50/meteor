import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
import rateLimit from '/imports/js/helpers/rate-limit.js';

import AdminActions from './adminActions';
import { validateUser } from '../helpers';

export const insertAdminAction = new ValidatedMethod({
  name: 'adminActions.insert',
  validate({ requestId, actionType }) {
    check(requestId, String);
    check(actionType, String);
    validateUser();
  },
  run({ requestId, actionType }) {
    // Make sure there isn't an action active with the same ID
    const actionExists = !!AdminActions.findOne({
      actionType,
      requestId,
      status: 'active',
    });
    if (actionExists) {
      throw new Meteor.Error('duplicate active admin action');
    }

    return AdminActions.insert({ actionType, requestId });
  },
});

export const completeAction = new ValidatedMethod({
  name: 'adminActions.complete',
  validate({ id }) {
    check(id, String);
    validateUser();
  },
  run({ id }) {
    const action = AdminActions.find({ _id: id });

    if (action.status === 'completed') {
      throw new Meteor.Error('action is already completed');
    }

    return AdminActions.update(id, {
      $set: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  },
});

export const completeActionByactionType = new ValidatedMethod({
  name: 'adminActions.completeByactionType',
  validate({ requestId, actionType, newStatus }) {
    check(requestId, String);
    check(actionType, String);
    check(newStatus, Match.Optional(String));
    validateUser();
  },
  run({ requestId, actionType, newStatus }) {
    const action = AdminActions.findOne({
      requestId,
      actionType,
      status: 'active',
    });

    if (!action) {
      throw new Meteor.Error("action couldn't be found");
    }

    return AdminActions.update(action._id, {
      $set: {
        status: newStatus || 'completed',
        completedAt: new Date(),
      },
    });
  },
});

export const removeParentRequest = new ValidatedMethod({
  name: 'adminActions.removeParentRequest',
  validate({ requestId }) {
    check(requestId, String);
  },
  run({ requestId }) {
    return AdminActions.update(
      { requestId },
      { $set: { status: 'parentDeleted' } },
    );
  },
});

rateLimit({ methods: [insertAdminAction, completeAction] });
