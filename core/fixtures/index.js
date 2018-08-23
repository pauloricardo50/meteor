import { Meteor } from 'meteor/meteor';
import { ROLES } from 'core/api/constants';
import { createFakeUsers } from './userFixtures';
import { DEV_COUNT } from './fixtureConfig';
import { createYannisUser } from './demoFixtures';

Meteor.startup(() => {
  if (Meteor.users.find({ roles: { $in: [ROLES.DEV] } }).count() === 0) {
    createFakeUsers(DEV_COUNT, ROLES.DEV);
  }

  if (Meteor.users.find({ 'emails.address': 'y@nnis.ch' }).count() === 0) {
    createYannisUser();
  }
});
