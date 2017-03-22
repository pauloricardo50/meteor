import { Meteor } from 'meteor/meteor';

import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Offers from '/imports/api/offers/offers';
import Borrowers from '/imports/api/borrowers/borrowers';

// Get all requests for this user
export function userRequestsComposer(props, onData) {
  if (Meteor.subscribe('loanRequests').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();
    onData(null, { loanRequests });
  }
}

// Get all requests for this user
export function userBorrowersComposer(props, onData) {
  if (Meteor.subscribe('borrowers').ready()) {
    const borrowers = Borrowers.find({}).fetch();
    onData(null, { borrowers });
  }
}

// Get all offers for this user
export function userOffersComposer(props, onData) {
  if (Meteor.subscribe('userOffers').ready()) {
    const offers = Offers.find({}).fetch();
    onData(null, { offers });
  }
}

// Get a specific request for this user
export function userRequestComposer(props, onData) {
  const requestId = props.params.id;
  if (Meteor.subscribe('loanRequest', requestId).ready()) {
    const loanRequest = LoanRequests.findOne({}).fetch();
    onData(null, { loanRequest });
  }
}

// Get a specific borrower for this user
export function userBorrowerComposer(props, onData) {
  const borrowerId = props.match.params.borrowerId;
  if (Meteor.subscribe('borrower', borrowerId).ready()) {
    const borrower = Borrowers.findOne({ _id: borrowerId });
    onData(null, { borrower });
  }
}
