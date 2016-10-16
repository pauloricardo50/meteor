import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CreditRequests } from './creditrequests.js';

export const insertRequest = new ValidatedMethod({
  name: 'creditrequests.insert',
  validate() {},
  run() {
    // Verify if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to create a request');
    }

    CreditRequests.insert({
      createdAt: new Date(),
      userId: this.userId,
      step: 0,
    });
  },
});
