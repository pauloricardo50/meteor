import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { resetDatabase } from 'meteor/xolvio:cleaner';

Meteor.methods({
  serverLog: (log) => {
    check(log, String);
    if (Meteor.isServer) {
      console.log('Logging from server: ', log);
    }
  },
  isLoggedIn() {
    return this.userId;
  },
  resetDatabase() {
    resetDatabase();
  },
});
