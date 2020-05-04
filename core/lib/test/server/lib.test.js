import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';

Meteor.methods({
  resetDatabase() {
    resetDatabase();
  },
});
