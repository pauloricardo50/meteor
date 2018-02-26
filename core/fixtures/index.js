import { Meteor } from 'meteor/meteor';
import createUsers from './users';
import { DEV_COUNT } from './config';

Meteor.startup(() => {
  if (Meteor.users.find({ roles: { $in: ['dev'] } }).count() === 0) {
    console.log('creating devs');
    createUsers(DEV_COUNT, 'dev');
  }
});
