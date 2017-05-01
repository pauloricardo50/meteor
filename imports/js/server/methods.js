import { Meteor } from 'meteor/meteor';

Meteor.methods({
  getServerTime() {
    return new Date();
  },
});
