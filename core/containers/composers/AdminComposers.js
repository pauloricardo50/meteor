import { Meteor } from 'meteor/meteor';

import {
  Loans,
  Offers,
  Borrowers,
  AdminActions,
  Properties,
} from '../../api';

export function adminLoansComposer(props, onData) {
  if (Meteor.subscribe('allLoans').ready()) {
    const loans = Loans.find({}).fetch();
    onData(null, { loans });
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

// Get the loan specified in the URL, the user and the offers for it
export function adminLoanComposer(props, onData) {
  const { loanId } = props.match.params;

  if (Meteor.subscribe('loan', loanId).ready()) {
    const loan = Loans.find({ _id: loanId }).fetch()[0];

    if (
      Meteor.subscribe('user', loan.userId).ready() &&
      Meteor.subscribe('loanOffers', loanId).ready() &&
      Meteor.subscribe('loanBorrowers', loan.borrowers).ready() &&
      Meteor.subscribe('property', loan.property).ready()
    ) {
      const user = Meteor.users.find({ _id: loan.userId }).fetch()[0];
      const offers = Offers.find({ loanId }).fetch();
      const borrowers = Borrowers.find({}).fetch();
      const property = Properties.find({}).fetch()[0];

      onData(null, {
        loan,
        user,
        offers,
        borrowers,
        property,
      });
    }
  }
}

// Get the user and its associated loans and borrowers
export function adminUserComposer(props, onData) {
  const { userId } = props.match.params;

  if (Meteor.subscribe('user', userId).ready()) {
    const user = Meteor.users.findOne(userId);
    if (
      Meteor.subscribe('userLoans', userId).ready() &&
      Meteor.subscribe('userBorrowers', userId).ready()
    ) {
      const loans = Loans.find().fetch();
      const propertyIds = loans && loans.map(r => r.property);
      if (Meteor.subscribe('userProperties', userId, propertyIds).ready()) {
        const borrowers = Borrowers.find().fetch();
        const properties = Properties.find().fetch();

        onData(null, {
          loans,
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
