import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import AdminActions from '../adminActions';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('allAdminActions', function publish() {
  // Verify if user is an admin
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    // Return all
    return AdminActions.find();
  }

  return this.ready();
});
