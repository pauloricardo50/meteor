import { Meteor } from 'meteor/meteor';

import LoanRequests from '../../api/loanrequests/loanrequests';
import Offers from '../../api/offers/offers';
import Borrowers from '../../api/borrowers/borrowers';
import AdminActions from '../../api/adminActions/adminActions';

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

export function adminActionsComposer(props, onData) {
  if (Meteor.subscribe('allAdminActions').ready()) {
    const adminActions = AdminActions.find({}).fetch();
    onData(null, { adminActions });
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
        if (
          Meteor.subscribe('requestBorrowers', loanRequest.borrowers).ready()
        ) {
          const borrowers = Borrowers.find({}).fetch();

          onData(null, { loanRequest, user, offers, borrowers });
        }
      }
    }
  }
}

// Get the user and its associated loanRequests and borrowers
export function adminUserComposer(props, onData) {
  const userId = props.match.params.userId;

  if (Meteor.subscribe('user', userId).ready()) {
    const user = Meteor.users.findOne(userId);
    if (Meteor.subscribe('userLoanRequests', userId).ready()) {
      const loanRequests = LoanRequests.find().fetch();
      if (Meteor.subscribe('userBorrowers', userId).ready()) {
        const borrowers = Borrowers.find({}).fetch();

        onData(null, { loanRequests, user, borrowers });
      }
    }
  }
}

export function adminOfferComposer(props, onData) {
  const offerId = props.match.params.offerId;

  if (Meteor.subscribe('offer', offerId).ready()) {
    const offer = Offers.findOne({}); // .fetch();

    onData(null, { offer });
  }
}
