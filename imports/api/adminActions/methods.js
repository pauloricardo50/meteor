import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
import rateLimit from '/imports/js/helpers/rate-limit.js';

import AdminActions from './adminActions';

export const insertAdminAction = new ValidatedMethod({
  name: 'adminActions.insert',
  validate({ requestId, actionId }) {
    check(requestId, String);
    check(actionId, String);
  },
  run({ requestId, actionId }) {
    // Make sure there isn't an action active with the same ID
    const actionExists = !!AdminActions.findOne({
      actionId,
      requestId,
      status: 'active',
    });
    if (actionExists) {
      throw new Meteor.Error('duplicate active admin action');
    }

    return AdminActions.insert({ actionId, requestId });
  },
});

export const completeAction = new ValidatedMethod({
  name: 'adminActions.complete',
  validate({ id }) {
    check(id, String);
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

export const completeActionByActionId = new ValidatedMethod({
  name: 'adminActions.completeByActionId',
  validate({ requestId, actionId, newStatus }) {
    check(requestId, String);
    check(actionId, String);
    check(newStatus, Match.Optional(String));
  },
  run({ requestId, actionId, newStatus }) {
    const action = AdminActions.findOne({
      requestId,
      actionId,
      status: 'active',
    });

    if (!!action) {
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
