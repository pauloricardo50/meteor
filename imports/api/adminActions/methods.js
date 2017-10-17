import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import rateLimit from '/imports/js/helpers/rate-limit.js';

import AdminActions from './adminActions';
import { validateUser } from '../helpers';

export const insertAdminAction = new ValidatedMethod({
  name: 'adminActions.insert',
  mixins: [CallPromiseMixin],
  validate({ requestId, type }) {
    check(requestId, String);
    check(type, String);
    validateUser();
  },
  run({ requestId, type }) {
    // Make sure there isn't an action active with the same ID
    const existingAction = AdminActions.findOne({
      type,
      requestId,
      status: 'active',
    });
    if (existingAction) {
      throw new Meteor.Error('duplicate active admin action');
    }

    return AdminActions.insert({ type, requestId });
  },
});

export const completeAction = new ValidatedMethod({
  name: 'adminActions.complete',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
    validateUser();
  },
  run({ id }) {
    const action = AdminActions.findOne(id);

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

export const completeActionByType = new ValidatedMethod({
  name: 'adminActions.completeActionByType',
  mixins: [CallPromiseMixin],
  validate({ requestId, type, newStatus }) {
    check(requestId, String);
    check(type, String);
    check(newStatus, Match.Optional(String));
    validateUser();
  },
  run({ requestId, type, newStatus }) {
    const action = AdminActions.findOne({
      requestId,
      type,
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
  mixins: [CallPromiseMixin],
  validate({ requestId }) {
    check(requestId, String);
  },
  run({ requestId }) {
    return AdminActions.update(
      { requestId },
      { $set: { status: 'parentDeleted' } },
      { multi: true },
    );
  },
});

rateLimit({ methods: [insertAdminAction, completeAction] });
