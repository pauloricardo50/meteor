import { Meteor } from 'meteor/meteor';
import { ROLES } from 'core/api/users/userConstants';
import { createFakeUsers } from './users';
import { DEV_COUNT } from './config';

Meteor.startup(() => {
  if (Meteor.users.find({ roles: { $in: [ROLES.DEV] } }).count() === 0) {
    createFakeUsers(DEV_COUNT, ROLES.DEV);
  }
});
