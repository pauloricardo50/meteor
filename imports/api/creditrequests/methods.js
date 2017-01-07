import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema';

import CreditRequests, { CreditRequestSchema } from './creditrequests.js';

export const insertRequest = new ValidatedMethod({
  name: 'creditrequests.insert',
  validate() {},
  run({ object }) {
    // Verify if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to create a request');
    }

    const userRequests = CreditRequests.find({ userId: this.userId });

    if (userRequests.length > 3) {
      throw new Meteor.Error('maxRequests', 'Vous ne pouvez pas avoir plus de 3 requêtes à la fois');
    }

    // Set all existing requests to inactive
    userRequests.forEach((request) => {
      CreditRequests.update(request._id, {
        $set: { active: false },
      });
    });

    CreditRequests.insert(object);
  },
});


export const incrementStep = new ValidatedMethod({
  name: 'creditrequests.incrementStep',
  validate({ id }) {
    check(id, String);

    // TODO: Verify that this request exists and is owned by the current user
  },
  run({ id }) {
    // Verify if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to increment step');
    }

    // TODO: Prevent increment if the current step is already at max step (5)

    CreditRequests.update(id, {
      $inc: { step: 1 },
    });
  },
});


// Lets you set an entire object in the document
export const updateValues = new ValidatedMethod({
  name: 'creditRequests.updateValues',
  validate: null,
  run({ object, id }) {
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
    }

    CreditRequests.update(id, {
      $set: object,
    });
  },
});


// Lets you push a value to an array
// export const pushValue = new ValidatedMethod({
//   name: 'creditRequests.pushValue',
//   validate: null,
//   run({ object, id }) {
//     if (!this.userId) {
//       throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
//     }
//
//     CreditRequests.update(id, {
//       $push: object,
//     });
//   },
// });


// Lets you pull a value from an array
// export const pullValue = new ValidatedMethod({
//   name: 'creditRequests.pullValue',
//   validate: null,
//   run({ value, id }) {
//     if (!this.userId) {
//       throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
//     }
//
//     CreditRequests.update(id, {
//       $pull: value,
//     });
//   },
// });
