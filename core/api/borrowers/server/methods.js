import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import rateLimit from '../../../utils/rate-limit.js';

import Borrowers from '../borrowers';

export const insertBorrower = new ValidatedMethod({
  name: 'insertBorrower',
  mixins: [CallPromiseMixin],
  validate() {},
  run({ object, userId }) {
    return Borrowers.insert({
      ...object,
      // Allow null as userId
      userId: userId === undefined ? Meteor.userId() : userId,
    });
  },
});

// Lets you set an entire object in the document
export const updateBorrower = new ValidatedMethod({
  name: 'updateBorrower',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return Borrowers.update(id, { $set: object });
  },
});

// Lets you push a value to an array
export const pushBorrowerValue = new ValidatedMethod({
  name: 'pushBorrowerValue',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return Borrowers.update(id, { $push: object });
  },
});

// Lets you pop a value from the end of an array
export const popBorrowerValue = new ValidatedMethod({
  name: 'popBorrowerValue',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return Borrowers.update(id, { $pop: object }, { getAutoValues: false });
  },
});

export const deleteBorrower = new ValidatedMethod({
  name: 'deleteBorrower',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (Roles.userIsInRole(Meteor.userId(), 'dev')) {
      return Borrowers.remove(id);
    }

    return false;
  },
});

export const deleteAllBorrowers = new ValidatedMethod({
  name: 'deleteAllBorrowers',
  mixins: [CallPromiseMixin],
  validate({ borrowers }) {
    check(borrowers, Array);
  },
  run({ borrowers }) {
    if (Roles.userIsInRole(Meteor.userId(), 'dev')) {
      borrowers.forEach(r => Borrowers.remove(r._id));
    }

    return false;
  },
});

rateLimit({
  methods: [
    insertBorrower,
    updateBorrower,
    pushBorrowerValue,
    popBorrowerValue,
    deleteBorrower,
  ],
});
