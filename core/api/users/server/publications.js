import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

Meteor.publish('allUsers', function publish() {
  // Verify if the current user is an admin
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    // Return all users
    return Meteor.users.find();
  }

  return this.ready();
});

Meteor.publish('currentUser', function publish() {
  if (Meteor.userId()) {
    return Meteor.users.find({ _id: Meteor.userId() });
  }
  // Return an empy cursor if not logged in
  return this.ready();
});

Meteor.publish('user', function publish(userId) {
  check(userId, String);
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    return Meteor.users.find({ _id: userId });
  }
  // Return an empy cursor if not logged in
  return this.ready();
});
