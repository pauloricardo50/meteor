import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  resetDb() {
    resetDatabase();
  },
});
