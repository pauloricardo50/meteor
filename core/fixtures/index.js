import { Meteor } from 'meteor/meteor';
import createFakeUsers from './users';
import { DEV_COUNT } from './config';

Meteor.startup(() => {
  if (Meteor.users.find({ roles: { $in: ['dev'] } }).count() === 0) {
    console.log('creating devs');
    createFakeUsers(DEV_COUNT, 'dev');
  }
});
