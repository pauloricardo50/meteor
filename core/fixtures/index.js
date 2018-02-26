import { Meteor } from 'meteor/meteor';
import createInitialDev from './initialDev';
// import createUsers from './users';
import './methods';

Meteor.startup(() => {
  if (Meteor.users.find({ roles: { $in: ['dev'] } }).count() === 0) {
    console.log('creating initial dev');
    createInitialDev();
  }
  // if (Meteor.users.find({ roles: { $in: ['user'] } }).count() === 0) {
  //   console.log('creating users');
  //   createUsers();
  // }
});
