import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import Users from '../users';

export const insertUser = new ValidatedMethod({
  name: 'insertUser',
  mixins: [CallPromiseMixin],
  validate({ object, userId }) {
    check(object, Object);
    if (userId) {
      check(userId, String);
    }
  },
  run({ object, userId }) {
    return Users.insert({
      ...object,
      userId: userId === undefined ? Meteor.userId() : userId,
    });
  },
});

export const deleteUser = new ValidatedMethod({
  name: 'deleteUser',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    return Users.remove(id);
  },
});

export const deleteAllUsers = new ValidatedMethod({
  name: 'deleteAllUsers',
  mixins: [CallPromiseMixin],
  validate({ users }) {
    check(users, Array);
  },
  run({ users }) {
    if (Roles.userIsInRole(Meteor.userId(), 'dev')) {
      users.forEach((r) => {
        if (r._id !== Meteor.userId()) {
          Users.remove(r._id);
        }
      });
    }

    return false;
  },
});

export const updateUser = new ValidatedMethod({
  name: 'updateUser',
  mixins: [CallPromiseMixin],
  validate({ id, object }) {
    check(id, String);
    check(object, Object);
  },
  run({ id, object }) {
    return Users.update(id, { $set: object });
  },
});
