import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import Tasks from '../tasks';

export const insertTask = new ValidatedMethod({
  name: 'insertTask',
  mixins: [CallPromiseMixin],
  validate({ object, userId }) {
    check(object, Object);
    if (userId) {
      check(userId, String);
    }
  },
  run({ object, userId }) {
    return Tasks.insert({
      ...object,
      userId: userId === undefined ? Meteor.userId() : userId,
    });
  },
});

export const deleteTask = new ValidatedMethod({
  name: 'deleteTask',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    return Tasks.remove(id);
  },
});

export const deleteAllTasks = new ValidatedMethod({
  name: 'deleteAllTasks',
  mixins: [CallPromiseMixin],
  validate({ tasks }) {
    check(tasks, Array);
  },
  run({ tasks }) {
    if (Roles.userIsInRole(Meteor.userId(), 'dev')) {
      tasks.forEach(r => Tasks.remove(r._id));
    }

    return false;
  },
});

export const updateTask = new ValidatedMethod({
  name: 'updateTask',
  mixins: [CallPromiseMixin],
  validate({ id, object }) {
    check(id, String);
    check(object, Object);
  },
  run({ id, object }) {
    return Tasks.update(id, { $set: object });
  },
});
