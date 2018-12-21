import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ROLES } from 'core/api/constants';
import { Method } from '../../api/methods';

const methodWitoutLimit = new Method({
  name: 'methodWitoutLimit',
  testRateLimit: true, // Additional param only for test limits logic
});
methodWitoutLimit.setHandler(() => 1);

const methodWithDefaultLimit = new Method({
  name: 'methodWithDefaultLimit',
  testRateLimit: true, // Additional param only for test limits logic
  rateLimit: {},
});
methodWithDefaultLimit.setHandler(() => 1);


const methodWithtLimit = new Method({
  name: 'methodWithtLimit',
  testRateLimit: true, // Additional param only for test limits logic
  rateLimit: {
    global: {
      limit: 3,
      timeRange: 1000,
    },
    [ROLES.DEV]: {
      limit: 4,
      timeRange: 1000,
    },
  },
});
methodWithtLimit.setHandler(() => 1);

Meteor.methods({
  serverLog: (log) => {
    check(log, String);
    if (Meteor.isServer) {
      console.log('Cypress logging from server: ', log);
    }
  },
  isLoggedIn() {
    return this.userId;
  },
  resetDatabase,
});
