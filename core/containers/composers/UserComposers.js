import { Meteor } from 'meteor/meteor';

import {
  LoanRequests,
  Offers,
  Borrowers,
  Properties,
  Comparators,
} from '../../api';

export function userCompareComposer(props, onData) {
  if (
    Meteor.subscribe('properties').ready() &&
    Meteor.subscribe('userComparators').ready()
  ) {
    const properties = Properties.find({}, { sort: { createdAt: -1 } }).fetch();
    const comparators = Comparators.find({}).fetch();
    onData(null, { properties, comparator: comparators[0] || undefined });
  }
}

// Get all requests for this user
export function userRequestsComposer(props, onData) {
  if (Meteor.subscribe('loanRequests').ready()) {
    const loanRequests = LoanRequests.find({}).fetch();
    onData(null, { loanRequests });
  }
}

// Get all borrowers for this user
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

// Get all properties for this user
export function userPropertiesComposer(props, onData) {
  if (Meteor.subscribe('properties').ready()) {
    const properties = Properties.find({}).fetch();
    onData(null, { properties });
  }
}

// Get a specific request for this user
export function userRequestComposer(props, onData) {
  if (
    Meteor.subscribe('loanRequests').ready() &&
    Meteor.subscribe('borrowers').ready() &&
    Meteor.subscribe('userOffers').ready()
  ) {
    const requestId = props.match.params.requestId;
    const loanRequest = LoanRequests.find({ _id: requestId }).fetch()[0];
    const borrowers = Borrowers.find({
      _id: { $in: loanRequest.borrowers },
    }).fetch();
    const offers = Offers.find({ requestId }).fetch();
    onData(null, { loanRequest, borrowers, offers });
  }
}

// Get a specific borrower for this user
export function userBorrowerComposer(props, onData) {
  const borrowerId = props.match.params.borrowerId;
  if (Meteor.subscribe('borrower', borrowerId).ready()) {
    const borrower = Borrowers.findOne(borrowerId);
    onData(null, { borrower });
  }
}
