import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

Meteor.publish('allUsers', function() {
  // Verify if the current user is an admin
  if (
    Roles.userIsInRole(this.userId, 'admin') ||
    Roles.userIsInRole(this.userId, 'dev')
  ) {
    // Return all users
    return Meteor.users.find();
  }

  return this.ready();
});

Meteor.publish('currentUser', function() {
  if (this.userId) {
    return Meteor.users.find({
      _id: this.userId,
    });
  }
  // Return an empy cursor if not logged in
  return this.ready();
});

Meteor.publish('user', function(id) {
  check(id, String);
  if (
    Roles.userIsInRole(this.userId, 'admin') ||
    Roles.userIsInRole(this.userId, 'dev')
  ) {
    return Meteor.users.find({
      _id: id,
    });
  }
  // Return an empy cursor if not logged in
  return this.ready();
});
