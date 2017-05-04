import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';

import Borrowers from './borrowers';

export const insertBorrower = new ValidatedMethod({
  name: 'borrowers.insert',
  validate() {},
  run({ object, userId }) {
    // Allow adding a userId for testing purposes
    object.userId = userId || this.userId;

    return Borrowers.insert(object);
  },
});

// Lets you set an entire object in the document
export const updateBorrower = new ValidatedMethod({
  name: 'borrowers.update',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return Borrowers.update(id, { $set: object });
  },
});

// Lets you push a value to an array
export const pushBorrowerValue = new ValidatedMethod({
  name: 'borrowers.pushValue',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    Borrowers.update(id, { $push: object });
  },
});

// Lets you pop a value from the end of an array
export const popBorrowerValue = new ValidatedMethod({
  name: 'borrowers.popValue',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    Borrowers.update(id, { $pop: object }, { getAutoValues: false });
  },
});
