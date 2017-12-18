import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import Offers from '../offers';
import LoanRequests from '../../loanrequests/loanrequests';

// Get all offers for the currently active request
Meteor.publish('activeOffers', () => {
  const activeRequest = LoanRequests.findOne({
    userId: Meteor.userId(),
    active: true,
  });

  return Offers.find({
    requestId: activeRequest._id,
  });
});

// Get all offers for the currently active request
Meteor.publish('userOffers', () => {
  const loanRequests = LoanRequests.find({
    userId: Meteor.userId(),
  });

  const IDs = loanRequests.map(r => r._id);

  return Offers.find({
    requestId: { $in: IDs },
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

// Publish all offers for a loanRequest for admins
Meteor.publish('requestOffers', function publish(requestId) {
  check(requestId, String);
  // Verify if user is logged In
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    // Return all users
    return Offers.find({
      requestId,
    });
  }

  return this.ready();
});
