import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';
import moment from 'moment';
import { Roles } from 'meteor/alanning:roles';

import LoanRequests from './loanrequests';

export const insertRequest = new ValidatedMethod({
  name: 'loanrequests.insert',
  validate() {},
  run({ object, userId }) {
    const userRequests = LoanRequests.find({ userId: Meteor.userId() });

    if (userRequests.length > 3) {
      throw new Meteor.Error(
        'maxRequests',
        'Vous ne pouvez pas avoir plus de 3 requêtes à la fois',
      );
    }

    // Allow adding a userId for testing purposes
    object.userId = userId || Meteor.userId();

    return LoanRequests.insert(object);
  },
});

// Lets you set an entire object in the document
export const updateRequest = new ValidatedMethod({
  name: 'loanRequests.update',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return LoanRequests.update(id, {
      $set: object,
    });
  },
});

// Increments the step of the request, if conditions are true
export const incrementStep = new ValidatedMethod({
  name: 'loanRequests.incrementStep',
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    const loanRequest = LoanRequests.findOne({ _id: id });
    const currentStep = loanRequest.logic.step;

    // TODO: make sure step is really done

    return LoanRequests.update(id, {
      $set: { 'logic.step': currentStep + 1 },
    });
  },
});

export const startAuction = new ValidatedMethod({
  name: 'loanRequests.startAuction',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    const auctionObject = {};
    auctionObject['logic.auctionStarted'] = true;
    auctionObject['logic.auctionStartTime'] = moment().toDate();
    auctionObject['general.a'];

    // object parameter only contains the isDemo value
    if (object.isDemo) {
      auctionObject['logic.auctionEndTime'] = moment().add(30, 's').toDate();
    } else {
      auctionObject['logic.auctionEndTime'] = getAuctionEndTime(moment());
    }

    console.log(`Temps de fin réel: ${getAuctionEndTime(moment())}`);

    return LoanRequests.update(id, {
      $set: auctionObject,
    });
  },
});

// Gives the end time of an auction, given the start time
export const getAuctionEndTime = function (startTime) {
  const endTime = startTime;

  if (startTime.isoWeekday() === 6) {
    // On saturdays, go to Tuesday
    endTime.add(3, 'd');
  } else if (startTime.isoWeekday() === 7) {
    // On saturdays, go to Tuesday
    endTime.add(2, 'd');
  } else if (startTime.hour() >= 0 && startTime.hour() < 7) {
    // If the start time is between midnight and 7:00, set endtime to be tomorrow night
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
  endTime.milliseconds(0);

  return endTime.toDate();
};

// Lets you push a value to an array
export const pushRequestValue = new ValidatedMethod({
  name: 'loanRequests.pushValue',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return LoanRequests.update(id, { $push: object });
  },
});

// Lets you pop a value from the end of an array
export const popRequestValue = new ValidatedMethod({
  name: 'loanRequests.popValue',
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return LoanRequests.update(id, { $pop: object });
  },
});

// if (Meteor.isServer) {
//   import { rateLimit } from '/imports/js/server/rate-limit.js';
//
//   rateLimit({
//     methods: [
//       updateValues,
//     ],
//     limit: 2,
//     timeRange: 1000,
//   });
// }

export const requestVerification = new ValidatedMethod({
  name: 'loanRequests.requestVerification',
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    return LoanRequests.update(id, {
      $set: {
        'logic.verification.requested': true,
        'logic.verification.requestedTime': new Date(),
      },
    });
  },
});

export const deleteRequest = new ValidatedMethod({
  name: 'loanRequests.delete',
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (
      Roles.userIsInRole(Meteor.userId(), 'dev') ||
      Roles.userIsInRole(Meteor.userId(), 'admin')
    ) {
      return LoanRequests.remove(id);
    }

    throw new Error('not authorized');
  },
});

export const finishAuction = new ValidatedMethod({
  name: 'loanRequests.finishAuction',
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return LoanRequests.update(id, { $set: { 'logic.auctionEndTime': new Date() } });
    }

    throw new Error('not authorized');
  },
});

export const cancelAuction = new ValidatedMethod({
  name: 'loanRequests.cancelAuction',
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return LoanRequests.update(id, {
        $set: {
          'logic.auctionEndTime': undefined,
          'logic.auctionStarted': false,
          'logic.auctionStartTime': undefined,
        },
      });
    }

    throw new Error('not authorized');
  },
});
