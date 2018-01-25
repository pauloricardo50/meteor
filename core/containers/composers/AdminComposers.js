import { Meteor } from 'meteor/meteor';

import {
  LoanRequests,
  Offers,
  Borrowers,
  AdminActions,
  Properties,
} from '../../api';

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

export function adminPropertiesComposer(props, onData) {
  if (Meteor.subscribe('allProperties').ready()) {
    const properties = Properties.find({}).fetch();
    onData(null, { properties });
  }
}

// Get the request specified in the URL, the user and the offers for it
export function adminRequestComposer(props, onData) {
  const { requestId } = props.match.params;

  if (Meteor.subscribe('loanRequest', requestId).ready()) {
    const loanRequest = LoanRequests.find({ _id: requestId }).fetch()[0];

    if (
      Meteor.subscribe('user', loanRequest.userId).ready() &&
      Meteor.subscribe('requestOffers', requestId).ready() &&
      Meteor.subscribe('requestBorrowers', loanRequest.borrowers).ready() &&
      Meteor.subscribe('property', loanRequest.property).ready()
    ) {
      const user = Meteor.users.find({ _id: loanRequest.userId }).fetch()[0];
      const offers = Offers.find({ requestId }).fetch();
      const borrowers = Borrowers.find({}).fetch();
      const property = Properties.find({}).fetch()[0];

      onData(null, {
        loanRequest,
        user,
        offers,
        borrowers,
        property,
      });
    }
  }
}

// Get the user and its associated loanRequests and borrowers
export function adminUserComposer(props, onData) {
  const { userId } = props.match.params;

  if (Meteor.subscribe('user', userId).ready()) {
    const user = Meteor.users.findOne(userId);
    if (
      Meteor.subscribe('userLoanRequests', userId).ready() &&
      Meteor.subscribe('userBorrowers', userId).ready()
    ) {
      const loanRequests = LoanRequests.find().fetch();
      const propertyIds = loanRequests && loanRequests.map(r => r.property);
      if (Meteor.subscribe('userProperties', userId, propertyIds).ready()) {
        const borrowers = Borrowers.find().fetch();
        const properties = Properties.find().fetch();

        onData(null, {
          loanRequests,
          user,
          borrowers,
          properties,
        });
      }
    }
  }
}

export function adminOfferComposer(props, onData) {
  const { offerId } = props.match.params;

  if (Meteor.subscribe('offer', offerId).ready()) {
    const offer = Offers.findOne({}); // .fetch();

    onData(null, { offer });
  }
}
