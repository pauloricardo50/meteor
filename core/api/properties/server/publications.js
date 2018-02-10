import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

import Properties from '../properties';

// Get all properties for the current user
Meteor.publish('properties', function publish() {
  // Verify if user is logged In
  if (!Meteor.userId()) {
    return this.ready();
  }

  return Properties.find({ userId: Meteor.userId() });
});

// Get all properties for the current user
Meteor.publish('userProperties', function publish(userId, propertyIds) {
  check(userId, String);
  check(propertyIds, [String]);
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    // Return all properties owned by this user, or pointed at by a loan
    return Properties.find({
      $or: [{ userId }, { _id: { $in: propertyIds } }],
    });
  }

  // Return an empy cursor if not logged in
  return this.ready();
});

// Get a property
Meteor.publish('property', function publish(propertyId) {
  check(propertyId, String);

  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    return Properties.find({ _id: propertyId });
  }

  // Return an empy cursor if not logged in
  return this.ready();
});

Meteor.publish('allProperties', function publish() {
  // Verify if user is an admin
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    // Return all
    return Properties.find();
  }

  return this.ready();
});
