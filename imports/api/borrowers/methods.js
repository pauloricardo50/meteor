import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';

import Borrowers from './borrowers';

export const insertBorrower = new ValidatedMethod({
  name: 'borrowers.insert',
  validate() {},
  run({ object }) {
    Borrowers.insert(object);
  },
});

// Lets you set an entire object in the document
export const updateBorrower = new ValidatedMethod({
  name: 'borrowers.update',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    Borrowers.update(id, { $set: object });
  },
});
