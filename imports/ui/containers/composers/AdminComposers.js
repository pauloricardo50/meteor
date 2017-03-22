import { Meteor } from 'meteor/meteor';

import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Offers from '/imports/api/offers/offers';

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
  const requestId = props.params.id;

  if (Meteor.subscribe('loanRequest', requestId).ready()) {
    const loanRequest = LoanRequests.find({}).fetch()[0];
    if (Meteor.subscribe('user', loanRequest.userId).ready()) {
      const user = Meteor.users.find({}).fetch()[0];
      if (Meteor.subscribe('requestOffers', requestId).ready()) {
        const offers = Offers.find({}).fetch();

        onData(null, { loanRequest, user, offers });
      }
    }
  }
}

export function adminUserComposer(props, onData) {
  const userId = props.params.userId;

  if (Meteor.subscribe('user', userId).ready()) {
    const user = Meteor.users.findOne({}).fetch();

    onData(null, { user });
  }
}

export function adminOfferComposer(props, onData) {
  const offerId = props.params.offerId;

  if (Meteor.subscribe('offer', offerId).ready()) {
    const offer = Offers.findOne({}).fetch();

    onData(null, { offer });
  }
}
