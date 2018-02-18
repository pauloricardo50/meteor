import { Meteor } from 'meteor/meteor';
import { EventService, mutations, Loans } from '../..';
import { EMAIL_IDS } from '../emailConstants';
import { SEND_EMAIL } from './emailMethods';

EventService.addMutationListener(
  mutations.REQUEST_LOAN_VERIFICATION,
  (params) => {
    const { loanId } = params;
    const { userId } = Loans.findOne(loanId);

    return Meteor.call(SEND_EMAIL, {
      emailId: EMAIL_IDS.VERIFICATION_REQUESTED,
      userId,
      params,
    });
  },
);

EventService.addMutationListener(mutations.START_AUCTION, (params) => {
  const { loanId } = params;
  const { userId } = Loans.findOne(loanId);

  return Meteor.call(SEND_EMAIL, {
    emailId: EMAIL_IDS.VERIFICATION_REQUESTED,
    userId,
    params,
  });
});

EventService.addMutationListener(mutations.END_AUCTION, (params) => {
  const { loanId } = params;
  const { userId } = Loans.findOne(loanId);

  return Meteor.call(SEND_EMAIL, {
    emailId: EMAIL_IDS.AUCTION_ENDED,
    userId,
    params,
  });
});

EventService.addMutationListener(mutations.CANCEL_AUCTION, (params) => {
  const { loanId } = params;
  const { userId } = Loans.findOne(loanId);

  return Meteor.call(SEND_EMAIL, {
    emailId: EMAIL_IDS.AUCTION_CANCELLED,
    userId,
    params,
  });
});
