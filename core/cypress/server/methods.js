import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

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
});
