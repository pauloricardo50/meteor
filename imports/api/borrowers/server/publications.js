import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import Borrowers from '../borrowers';

// Publish a specific loanRequest with an ID
Meteor.publish('borrower', function publish(id) {
  // Verify if user is logged In
  if (!this.userId) {
    return this.ready();
  }

  check(id, String);

  if (
    Roles.userIsInRole(this.userId, 'admin') ||
    Roles.userIsInRole(this.userId, 'dev')
  ) {
    return Borrowers.find({
      _id: id,
    });
  }

  return Borrowers.find({
    userId: this.userId,
    _id: id,
  });
});

// Publish all borrowers from the current user
Meteor.publish('borrowers', function publish() {
  // Verify if user is logged In
  if (!this.userId) {
    return this.ready();
  }

  return Borrowers.find({
    userId: this.userId,
  });
});

// Publish all borrowers in the database for admins
Meteor.publish('allBorrowers', function publish() {
  // Verify if user is logged In
  if (
    Roles.userIsInRole(this.userId, 'admin') ||
    Roles.userIsInRole(this.userId, 'dev')
  ) {
    // Return all users
    return Borrowers.find();
  }

  return this.ready();
});

// Publish all borrowers for a loanRequest for admins
Meteor.publish('requestBorrowers', function(borrowerIds) {
  check(borrowerIds, [String]);
  // Verify if user is an admin
  if (
    Roles.userIsInRole(this.userId, 'admin') ||
    Roles.userIsInRole(this.userId, 'dev')
  ) {
    // Return all borrowers
    return Borrowers.find({
      _id: { $in: borrowerIds },
    });
  }

  return this.ready();
});
