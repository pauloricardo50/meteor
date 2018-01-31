import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import Offers from '../offers';
import Loans from '../../loans/loans';

// Get all offers for the currently active loan
Meteor.publish('activeOffers', () => {
  const activeLoan = Loans.findOne({
    userId: Meteor.userId(),
    active: true,
  });

  return Offers.find({
    loanId: activeLoan._id,
  });
});

// Get all offers for the currently active loan
Meteor.publish('userOffers', () => {
  const loans = Loans.find({
    userId: Meteor.userId(),
  });

  const IDs = loans.map(r => r._id);

  return Offers.find({
    loanId: { $in: IDs },
  });
});

// Get all offers the partner has made
Meteor.publish('partnerOffers', function publish() {
  const user = Meteor.users.findOne(Meteor.userId());

  if (Roles.userIsInRole(Meteor.userId(), 'partner')) {
    return Offers.find({
      organization: user.profile && user.profile.organization,
      // auctionEndTime: { $lt: new Date() },
    });
  }

  return this.ready();
});

// Publish all offers in the database for admins
Meteor.publish('allOffers', function publish() {
  // Verify if user is logged In
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    // Return all users
    return Offers.find();
  }

  return this.ready();
});

// Publish all offers for a loan for admins
Meteor.publish('loanOffers', function publish(loanId) {
  check(loanId, String);
  // Verify if user is logged In
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    return Offers.find({ loanId });
  }

  return this.ready();
});
