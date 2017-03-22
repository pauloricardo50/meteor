import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import Borrowers from '../borrowers';

// Publish a specific loanRequest with an ID
Meteor.publish('borrower', function publish(id) {
  check(id, String);

  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Borrowers.find({
      _id: id,
    });
  }

  return Borrowers.find({
    userId: this.userId,
    _id: id,
  });

  // Throw unauthorized error
});

// Publish all borrowers from the current user
Meteor.publish('borrowers', function publish() {
  // Verify if user is logged In
  if (!this.userId) {
    return false;
  }

  return Borrowers.find({
    userId: this.userId,
  });
});

// Publish all loanrequests in the database for admins
Meteor.publish('allBorrowers', function publish() {
  // Verify if user is logged In
  if (Roles.userIsInRole(this.userId, 'admin')) {
    // Return all users
    return Borrowers.find();
  }

  return this.ready();
});
