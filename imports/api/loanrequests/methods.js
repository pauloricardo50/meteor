import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';
import moment from 'moment';

import SimpleSchema from 'simpl-schema';

import LoanRequests, { LoanRequestSchema } from './loanrequests.js';

export const insertRequest = new ValidatedMethod({
  name: 'loanrequests.insert',
  validate() {},
  run({ object }) {
    // Verify if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to create a request');
    }

    const userRequests = LoanRequests.find({ userId: this.userId });

    if (userRequests.length > 3) {
      throw new Meteor.Error('maxRequests', 'Vous ne pouvez pas avoir plus de 3 requêtes à la fois');
    }

    // Set all existing requests to inactive
    userRequests.forEach((request) => {
      LoanRequests.update(request._id, {
        $set: { active: false },
      });
    });

    LoanRequests.insert(object);
  },
});


export const incrementStep = new ValidatedMethod({
  name: 'loanrequests.incrementStep',
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    // Verify if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to increment step');
    }
    const request = LoanRequests.findOne({ _id: id });
    if (request.userId !== this.userId) {
      throw new Meteor.Error('notOwnerOfRequest', 'You\'re not allowed to edit this request');
    }

    // TODO: Prevent increment if the current step is already at max step (5)
    LoanRequests.update(id, {
      $inc: { step: 1 },
    });
  },
});


// Lets you set an entire object in the document
export const updateValues = new ValidatedMethod({
  name: 'loanRequests.updateValues',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
    }
    const request = LoanRequests.findOne({ _id: id });
    if (request.userId !== this.userId) {
      throw new Meteor.Error('notOwnerOfRequest', 'You\'re not allowed to access this request');
    }

    LoanRequests.update(id, {
      $set: object,
    });
  },
});

export const startAuction = new ValidatedMethod({
  name: 'loanRequests.startAuction',
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
    }

    const request = LoanRequests.findOne({ _id: id });
    if (request.userId !== this.userId) {
      throw new Meteor.Error('notOwnerOfRequest', 'You\'re not allowed to access this request');
    }

    const object = {};
    object['logic.auctionStarted'] = true;
    object['logic.auctionStartTime'] = moment().toDate();
    object['general.a']


    // TODO: Changer cet assignment de 60 secondes pour getAuctionEndTime(moment())
    object['logic.auctionEndTime'] = moment().add(30, 'm').toDate();
    console.log('Temps de fin réel: ' + getAuctionEndTime(moment()));

    LoanRequests.update(id, {
      $set: object,
    });
  },
});


// Gives the end tim of an auction, given the start time
const getAuctionEndTime = function (startTime) {
  const endTime = startTime;

  // If the start time is between midnight and 7:00, set endtime to be tomorrow night
  if (startTime.hour() >= 0 && startTime.hour() < 7) {
    endTime.add(1, 'd');
  } else {
    // Else, set endtime in 2 days from now
    endTime.add(2, 'd');
  }

  // Skip weekends
  if (endTime.isoWeekday() === 6 || endTime.isoWeekday() === 7) {
    // Saturday or Sunday
    endTime.add(2, 'd');
  }

  // Auctions always end at midnight
  endTime.hours(23);
  endTime.minutes(59);
  endTime.seconds(59);

  return endTime.toDate();
};


// Lets you push a value to an array
export const pushValue = new ValidatedMethod({
  name: 'loanRequests.pushValue',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
    }
    const request = LoanRequests.findOne({ _id: id });
    if (request.userId !== this.userId) {
      throw new Meteor.Error('notOwnerOfRequest', 'You\'re not allowed to access this request');
    }

    LoanRequests.update(id, {
      $push: object,
    });
  },
});


// Lets you pop a value from the end of an array
export const popValue = new ValidatedMethod({
  name: 'loanRequests.popValue',
  validate({ id }) {
    check(id, String);
  },
  run({ value, id }) {
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
    }
    const request = LoanRequests.findOne({ _id: id });
    if (request.userId !== this.userId) {
      throw new Meteor.Error('notOwnerOfRequest', 'You\'re not allowed to access this request');
    }

    LoanRequests.update(id, {
      $pop: value,
    });
  },
});
