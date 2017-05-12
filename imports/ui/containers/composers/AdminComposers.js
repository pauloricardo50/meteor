import { Meteor } from 'meteor/meteor';

import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Offers from '/imports/api/offers/offers';
import Borrowers from '/imports/api/borrowers/borrowers';

export function adminRequestsComposer(props, onData) {
  if (Meteor.subscribe('allLoanRequests').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();

    onData(null, { loanRequests });
  }
}

export function adminUsersComposer(props, onData) {
  if (Meteor.subscribe('allUsers').ready()) {
    const users = Meteor.users.find({}).fetch();

    onData(null, { users });
  }
}

export function adminOffersComposer(props, onData) {
  if (Meteor.subscribe('allOffers').ready()) {
    const offers = Offers.find({}).fetch();

    onData(null, { offers });
  }
}

// Get the request specified in the URL, the user and the offers for it
export function adminRequestComposer(props, onData) {
  const requestId = props.match.params.requestId;

  if (Meteor.subscribe('loanRequest', requestId).ready()) {
    const loanRequest = LoanRequests.find({ _id: requestId }).fetch()[0];
    if (Meteor.subscribe('user', loanRequest.userId).ready()) {
      const user = Meteor.users.find({ _id: loanRequest.userId }).fetch()[0];
      if (Meteor.subscribe('requestOffers', requestId).ready()) {
        const offers = Offers.find({ requestId }).fetch();
        if (Meteor.subscribe('allBorrowers').ready()) {
          const borrowers = Borrowers.find({
            _id: { $in: loanRequest.borrowers },
          }).fetch();

          onData(null, { loanRequest, borrowers, user, offers });
        }
      }
    }
  }
}

export function adminUserComposer(props, onData) {
  const userId = props.match.params.userId;

  if (Meteor.subscribe('user', userId).ready()) {
    const user = Meteor.users.findOne({ _id: userId }); // .fetch();

    onData(null, { user });
  }
}

export function adminOfferComposer(props, onData) {
  const offerId = props.match.params.offerId;

  if (Meteor.subscribe('offer', offerId).ready()) {
    const offer = Offers.findOne({}); // .fetch();

    onData(null, { offer });
  }
}
