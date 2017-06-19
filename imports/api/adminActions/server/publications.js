import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import AdminActions from '../adminActions';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('allAdminActions', function () {
  // Verify if user is an admin
  if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'dev')) {
    // Return all
    return AdminActions.find();
  }

  return this.ready();
});
