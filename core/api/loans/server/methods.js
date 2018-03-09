import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import moment from 'moment';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import rateLimit from '../../../utils/rate-limit.js';
import { getAuctionEndTime } from '../../../utils/loanFunctions';

import {
  insertAdminAction,
  completeActionByType,
  removeParentLoan,
} from 'core/api/adminActions/server/methods';

import Loans from '../loans';
import {
  ADMIN_ACTION_TYPE,
  ADMIN_ACTION_STATUS,
  LOAN_STATUS,
  AUCTION_STATUS,
} from '../../constants';

const importServerMethods = () => {
  if (Meteor.isServer || (!!this && !this.isSimulation)) {
    const {
      scheduleMethod,
      rescheduleJob,
    } = require('core/api/jobs/server/methods');
    const {
      sendEmail,
      cancelScheduledEmail,
      rescheduleEmail,
    } = require('core/api/email/server/email-methods');

    return {
      scheduleMethod,
      sendEmail,
      cancelScheduledEmail,
      rescheduleEmail,
    };
  }
};

export const insertLoan = new ValidatedMethod({
  name: 'insertLoan',
  mixins: [CallPromiseMixin],
  validate() {},
  run({ object, userId }) {
    // const loanCount = Loans.find({ userId: Meteor.userId() }).count();
    //
    // if (loanCount > 3) {
    //   throw new Meteor.Error(
    //     'maxLoans',
    //     'Vous ne pouvez pas avoir plus de 3 requêtes à la fois',
    //   );
    // }
    //
    // console.log(object);

    // Allow adding a userId for testing purposes
    return Loans.insert({
      ...object,
      // Do this to allow userId to be null
      userId: userId === undefined ? Meteor.userId() : userId,
    });
  },
});

// Lets you set an entire object in the document
export const updateLoan = new ValidatedMethod({
  name: 'updateLoan',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return Loans.update(id, { $set: object });
  },
});

// Increments the step of the loan, if conditions are true
export const incrementStep = new ValidatedMethod({
  name: 'incrementStep',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    const loan = Loans.findOne(id);
    const currentStep = loan.logic.step;

    return Loans.update(id, { $set: { 'logic.step': currentStep + 1 } });
  },
});

export const startAuction = new ValidatedMethod({
  name: 'startAuctionOld',
  mixins: [CallPromiseMixin],
  validate({ id, object }) {
    check(id, String);
    check(object, Match.Optional(Object));
  },
  run({ object, id }) {
    let auctionEndTime;

    // object parameter only contains the isDemo value
    if (object.isDemo) {
      auctionEndTime = moment()
        .add(30, 's')
        .toDate();
      console.log(`Temps de fin réel: ${getAuctionEndTime(moment())}`);
    } else {
      auctionEndTime = getAuctionEndTime(moment());
    }

    const auctionObject = {
      'logic.auction.status': AUCTION_STATUS.STARTED,
      'logic.auction.startTime': moment().toDate(),
      'logic.auction.endTime': auctionEndTime,
    };

    if (Meteor.isServer) {
      const { scheduleMethod, sendEmail } = importServerMethods();

      Loans.update(id, { $set: auctionObject });
      return insertAdminAction
        .callPromise({
          loanId: id,
          type: ADMIN_ACTION_TYPE.AUCTION,
          extra: { auctionEndTime },
        })
        .then(() =>
          sendEmail.callPromise({
            emailId: 'auctionStarted',
            loanId: id,
            intlValues: { date: auctionEndTime },
          }))
        .then(() =>
          scheduleMethod.callPromise({
            method: 'loans.endAuction',
            params: [{ id }],
            date: auctionEndTime,
          }))
        .then(() => 'success')
        .catch((e) => {
          throw e;
        });
    }
  },
});

// Lets you push a value to an array
export const pushLoanValue = new ValidatedMethod({
  name: 'pushLoanValue',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    const result = Loans.update(id, { $push: object });
    return result;
  },
});

// Lets you pop a value from the end of an array
export const popLoanValue = new ValidatedMethod({
  name: 'popLoanValue',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return Loans.update(id, { $pop: object });
  },
});

export const loanVerification = new ValidatedMethod({
  name: 'loanVerification',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    const loan = Loans.findOne(id);

    if (loan.logic.verification.requested) {
      // Don't do anything if this loan is already in requested mode
      return false;
    }

    // Insert an admin action and set the proper keys in the loan
    Loans.update(
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
            loanId: id,
          });
        }
      },
    );
    return Meteor.wrapAsync(insertAdminAction.call({
      type: ADMIN_ACTION_TYPE.VERIFY,
      loanId: id,
    }));
  },
});

export const deleteLoan = new ValidatedMethod({
  name: 'deleteLoan',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (
      Roles.userIsInRole(Meteor.userId(), 'dev') ||
      Roles.userIsInRole(Meteor.userId(), 'admin')
    ) {
      return Loans.remove(id, (err) => {
        if (!err) {
          removeParentLoan.call({ loanId: id });
        }
      });
    }

    throw new Meteor.Error('not authorized');
  },
});

export const endAuction = new ValidatedMethod({
  name: 'endAuctionOld',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    console.log('ending loan..');
    const loan = Loans.findOne(id);

    // This method is called in the future, so make sure that it isn't
    // executed again if this has already been done
    if (!loan || loan.logic.auction.status === AUCTION_STATUS.ENDED) {
      return;
    }

    Loans.update(id, {
      $set: {
        'logic.auction.status': AUCTION_STATUS.ENDED,
        'logic.auction.endTime': new Date(),
      },
    });

    completeActionByType.call({
      loanId: id,
      type: ADMIN_ACTION_TYPE.AUCTION,
    });

    if (Meteor.isServer) {
      const {
        scheduleMethod,
        sendEmail,
        cancelScheduledEmail,
        rescheduleEmail,
      } = importServerMethods();

      const loan = Loans.findOne(id);
      const email = loan.emails.find(e => e && e.emailId === 'auctionEnded' && e.scheduledAt >= new Date());
      if (email) {
        cancelScheduledEmail.call('email.cancelScheduled', {
          id: email._id,

          loanId: id,
          template: 'notification+CTA',
        });
      }
    }
  },
});

export const cancelAuction = new ValidatedMethod({
  name: 'cancelAuctionOld',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ id }) {
    if (
      Roles.userIsInRole(Meteor.userId(), 'admin') ||
      Roles.userIsInRole(Meteor.userId(), 'dev')
    ) {
      return Loans.update(
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

            const loan = Loans.findOne(id);
            const email = loan.emails.find(e =>
              e && e.emailId === 'auctionEnded' && e.scheduledAt >= new Date());
            if (email) {
              cancelScheduledEmail.call('email.cancelScheduled', {
                id: email._id,
                loanId: id,
              });
            }
          }

          completeActionByType.call({
            loanId: id,
            type: ADMIN_ACTION_TYPE.AUCTION,
            newStatus: ADMIN_ACTION_STATUS.CANCELLED,
          });
        },
      );
    }

    throw new Meteor.Error('not authorized');
  },
});

export const confirmClosing = new ValidatedMethod({
  name: 'confirmClosingOld',
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
      return Loans.update(id, {
        $set: { status: LOAN_STATUS.DONE, ...object },
      });
    }

    throw new Meteor.Error('not authorized');
  },
});

export const addEmail = new ValidatedMethod({
  name: 'addEmail',
  mixins: [CallPromiseMixin],
  validate({ loanId, emailId, _id, status, sendAt }) {
    check(loanId, String);
    check(emailId, String);
    check(_id, String);
    check(status, String);
    check(sendAt, Match.Optional(Date));
  },
  run({ loanId, emailId, _id, status, sendAt }) {
    const object = {
      emailId,
      _id,
      status,
      updatedAt: new Date(),
    };

    if (sendAt) {
      object.scheduledAt = sendAt;
    }

    return Loans.update(loanId, { $push: { emails: object } });
  },
});

export const modifyEmail = new ValidatedMethod({
  name: 'modifyEmail',
  mixins: [CallPromiseMixin],
  validate({ loanId, _id, status, sendAt }) {
    check(loanId, String);
    check(_id, String);
    check(status, Match.Optional(String));
    check(sendAt, Match.Optional(Date));
  },
  run({ loanId, _id, status, sendAt }) {
    const object = {
      'emails.$.status': status,
      'emails.$.updatedAt': new Date(),
    };

    if (sendAt) {
      object['emails.$.scheduledAt'] = sendAt;
    }

    return Loans.update({ _id: loanId, 'emails._id': _id }, { $set: object });
  },
});

rateLimit({
  methods: [
    insertLoan,
    updateLoan,
    incrementStep,
    startAuction,
    pushLoanValue,
    popLoanValue,
    loanVerification,
    // deleteLoan,
    cancelAuction,
    confirmClosing,
    addEmail,
    modifyEmail,
  ],
});
