import { Meteor } from 'meteor/meteor';
import createUsers from './users';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    createUsers();
  }
});
