import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import moment from 'moment';
import { Roles } from 'meteor/alanning:roles';
import rateLimit from '/imports/js/helpers/rate-limit.js';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import {
  insertAdminAction,
  completeActionByType,
  removeParentRequest,
} from '/imports/api/adminActions/methods';

import LoanRequests from './loanrequests';

const importServerMethods = () => {
  if (!this.isSimulation) {
    const { scheduleMethod } = require('/imports/api/server/jobs/methods');
    const {
      sendEmail,
      cancelScheduledEmail,
      rescheduleEmail,
    } = require('/imports/js/server/email/email-methods');

    return {
      scheduleMethod,
      sendEmail,
      cancelScheduledEmail,
      rescheduleEmail,
    };
  }
};

export const insertRequest = new ValidatedMethod({
  name: 'loanrequests.insert',
  mixins: [CallPromiseMixin],
  validate() {},
  run({ object, userId }) {
    const requestCount = LoanRequests.find({ userId: Meteor.userId() }).count();

    if (requestCount > 3) {
      throw new Meteor.Error(
        'maxRequests',
        'Vous ne pouvez pas avoir plus de 3 requêtes à la fois',
      );
    }

    // Allow adding a userId for testing purposes
    return LoanRequests.insert({
      ...object,
      userId: userId || Meteor.userId(),
    });
  },
});

export const testInsert = new ValidatedMethod({
  name: 'testInsert',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ userId, object }) {
    return LoanRequests.insert({ ...object, userId });
  },
});

// Lets you set an entire object in the document
export const updateRequest = new ValidatedMethod({
  name: 'loanRequests.update',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return LoanRequests.update(id, { $set: object });
  },
});

// Increments the step of the request, if conditions are true
export const incrementStep = new ValidatedMethod({
  name: 'loanRequests.incrementStep',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    const loanRequest = LoanRequests.findOne(id);
    const currentStep = loanRequest.logic.step;

    // TODO: make sure step is really done

    return LoanRequests.update(id, { $set: { 'logic.step': currentStep + 1 } });
  },
});

export const startAuction = new ValidatedMethod({
  name: 'loanRequests.startAuction',
  mixins: [CallPromiseMixin],
  validate({ id, object }) {
    check(id, String);
    check(object, Match.Optional(Object));
  },
  run({ object, id }) {
    let auctionEndTime;

    // object parameter only contains the isDemo value
    if (object.isDemo) {
      auctionEndTime = moment().add(30, 's').toDate();
      console.log(`Temps de fin réel: ${getAuctionEndTime(moment())}`);
    } else {
      auctionEndTime = getAuctionEndTime(moment());
    }

    const auctionObject = {
      'logic.auction.status': 'started',
      'logic.auction.startTime': moment().toDate(),
      'logic.auction.endTime': auctionEndTime,
    };

    if (Meteor.isServer) {
      const {
        scheduleMethod,
        sendEmail,
        cancelScheduledEmail,
        rescheduleEmail,
      } = importServerMethods();

      LoanRequests.update(id, { $set: auctionObject });
      return insertAdminAction
        .callPromise({
          requestId: id,
          type: 'auction',
          extra: { auctionEndTime },
        })
        .then(() =>
          sendEmail.callPromise({
            emailId: 'auctionStarted',
            requestId: id,
            intlValues: { date: auctionEndTime },
          }),
        )
        .then(() =>
          scheduleMethod.callPromise({
            method: 'loanRequests.endAuction',
            params: [{ id }],
            date: auctionEndTime,
          }),
        )
        .then(() => 'success')
        .catch((e) => {
          throw e;
        });
    }
  },
});

// Gives the end time of an auction, given the start time
export const getAuctionEndTime = (startTime) => {
  const time = moment(startTime);

  if (time.isoWeekday() === 6) {
    // On saturdays, go to Tuesday
    time.add(3, 'd');
  } else if (time.isoWeekday() === 7) {
    // On saturdays, go to Tuesday
    time.add(2, 'd');
  } else if (time.hour() >= 0 && time.hour() < 7) {
    // If the start time is between midnight and 7:00,
    // set endtime to be tomorrow night
    time.add(1, 'd');
  } else {
    // Else, set endtime in 2 days from now
    time.add(2, 'd');
  }

  // Skip weekends
  if (time.isoWeekday() === 6 || time.isoWeekday() === 7) {
    // Saturday or Sunday
    time.add(2, 'd');
  }

  // Auctions always end at midnight
  time.hours(23);
  time.minutes(59);
  time.seconds(59);
  time.milliseconds(0);

  return time.toDate();
};

// Lets you push a value to an array
export const pushRequestValue = new ValidatedMethod({
  name: 'loanRequests.pushValue',
  mixins: [CallPromiseMixin],
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
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return LoanRequests.update(id, { $pop: object });
  },
});

export const requestVerification = new ValidatedMethod({
  name: 'loanRequests.requestVerification',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    const request = LoanRequests.findOne(id);

    if (request.logic.verification.requested) {
      // Don't do anything if this request is already in requested mode
      return false;
    }

    // Insert an admin action and set the proper keys in the loanRequest
    LoanRequests.update(
      id,
      {
        $set: {
          'logic.verification.requested': true,
          'logic.verification.requestedTime': new Date(),
        },
      },
      (err) => {
        if (!err && Meteor.isServer) {
          const {
            scheduleMethod,
            sendEmail,
            cancelScheduledEmail,
            rescheduleEmail,
          } = importServerMethods();

          sendEmail.call({
            emailId: 'verificationRequested',
            requestId: id,
          });
        }
      },
    );
    return Meteor.wrapAsync(
      insertAdminAction.call({ type: 'verify', requestId: id }),
    );
  },
});

export const deleteRequest = new ValidatedMethod({
  name: 'loanRequests.delete',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (
      Roles.userIsInRole(Meteor.userId(), 'dev') ||
      Roles.userIsInRole(Meteor.userId(), 'admin')
    ) {
      return LoanRequests.remove(id, (err) => {
        if (!err) {
          removeParentRequest.call({ requestId: id });
        }
      });
    }

    throw new Meteor.Error('not authorized');
  },
});

export const endAuction = new ValidatedMethod({
  name: 'loanRequests.endAuction',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    console.log('ending request..');
    const request = LoanRequests.findOne(id);

    // This method is called in the future, so make sure that it isn't
    // executed again if this has already been done
    if (!request || request.logic.auction.status === 'ended') {
      return;
    }

    LoanRequests.update(id, {
      $set: {
        'logic.auction.status': 'ended',
        'logic.auction.endTime': new Date(),
      },
    });

    completeActionByType.call({ requestId: id, type: 'auction' });

    if (Meteor.isServer) {
      const {
        scheduleMethod,
        sendEmail,
        cancelScheduledEmail,
        rescheduleEmail,
      } = importServerMethods();

      sendEmail.call({
        emailId: 'auctionEnded',
        requestId: id,
        template: 'notification+CTA',
      });
    }
  },
});

export const finishAuction = new ValidatedMethod({
  name: 'loanRequests.finishAuction',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (
      Roles.userIsInRole(Meteor.userId(), 'admin') ||
      Roles.userIsInRole(Meteor.userId(), 'dev')
    ) {
      return LoanRequests.update(
        id,
        { $set: { 'logic.auctionEndTime': new Date() } },
        (error) => {
          if (!error && Meteor.isServer) {
            const {
              scheduleMethod,
              sendEmail,
              cancelScheduledEmail,
              rescheduleEmail,
            } = importServerMethods();

            const request = LoanRequests.findOne(id);
            const email = request.emails.find(
              e => e.emailId === 'auctionEnded' && e.scheduledAt >= new Date(),
            );
            if (email) {
              // Reschedule email to now
              rescheduleEmail.call({
                id: email._id,
                requestId: id,
                date: new Date(),
              });
            }
          }

          completeActionByType.call({
            requestId: id,
            type: 'auction',
          });
        },
      );
    }

    throw new Meteor.Error('not authorized');
  },
});

export const cancelAuction = new ValidatedMethod({
  name: 'loanRequests.cancelAuction',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (
      Roles.userIsInRole(Meteor.userId(), 'admin') ||
      Roles.userIsInRole(Meteor.userId(), 'dev')
    ) {
      return LoanRequests.update(
        id,
        {
          $set: {
            'logic.auction.endTime': undefined,
            'logic.auction.status': '',
            'logic.auction.startTime': undefined,
          },
        },
        (error) => {
          if (!error && Meteor.isServer) {
            const {
              scheduleMethod,
              sendEmail,
              cancelScheduledEmail,
              rescheduleEmail,
            } = importServerMethods();

            const request = LoanRequests.findOne(id);
            const email = request.emails.find(
              e =>
                e &&
                e.emailId === 'auctionEnded' &&
                e.scheduledAt >= new Date(),
            );
            if (email) {
              cancelScheduledEmail.call('email.cancelScheduled', {
                id: email._id,
                requestId: id,
              });
            }
          }

          completeActionByType.call({
            requestId: id,
            type: 'auction',
            newStatus: 'cancelled',
          });
        },
      );
    }

    throw new Meteor.Error('not authorized');
  },
});

export const confirmClosing = new ValidatedMethod({
  name: 'loanRequests.confirmClosing',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id, object }) {
    // TODO: Send email to user, clean up, etc.

    if (
      Roles.userIsInRole(Meteor.userId(), 'admin') ||
      Roles.userIsInRole(Meteor.userId(), 'dev')
    ) {
      return LoanRequests.update(id, {
        $set: { status: 'done', ...object },
      });
    }

    throw new Meteor.Error('not authorized');
  },
});

export const addEmail = new ValidatedMethod({
  name: 'loanRequests.addEmail',
  mixins: [CallPromiseMixin],
  validate({ requestId, emailId, _id, status, sendAt }) {
    check(requestId, String);
    check(emailId, String);
    check(_id, String);
    check(status, String);
    check(sendAt, Match.Optional(Date));
  },
  run({ requestId, emailId, _id, status, sendAt }) {
    const object = { emailId, _id, status, updatedAt: new Date() };

    if (sendAt) {
      object.scheduledAt = sendAt;
    }

    return LoanRequests.update(requestId, { $push: { emails: object } });
  },
});

export const modifyEmail = new ValidatedMethod({
  name: 'loanRequests.modifyEmail',
  mixins: [CallPromiseMixin],
  validate({ requestId, _id, status, sendAt }) {
    check(requestId, String);
    check(_id, String);
    check(status, Match.Optional(String));
    check(sendAt, Match.Optional(Date));
  },
  run({ requestId, _id, status, sendAt }) {
    const object = {
      'emails.$.status': status,
      'emails.$.updatedAt': new Date(),
    };

    if (sendAt) {
      object['emails.$.scheduledAt'] = sendAt;
    }

    return LoanRequests.update(
      { _id: requestId, 'emails._id': _id },
      { $set: object },
    );
  },
});

rateLimit({
  methods: [
    insertRequest,
    updateRequest,
    incrementStep,
    startAuction,
    pushRequestValue,
    popRequestValue,
    requestVerification,
    deleteRequest,
    finishAuction,
    cancelAuction,
    confirmClosing,
    addEmail,
    modifyEmail,
  ],
});
