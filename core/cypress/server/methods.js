import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ROLES } from 'core/api/constants';
import { Method } from '../../api/methods';

const methodWithoutSetLimit = new Method({
  name: 'methodWithoutSetLimit',
  testRateLimit: true, // Additional param only for test limits logic
});
methodWithoutSetLimit.setHandler(() => 1);

const methodWithSetDefaultLimit = new Method({
  name: 'methodWithSetDefaultLimit',
  testRateLimit: true, // Additional param only for test limits logic
  rateLimit: {},
});
methodWithSetDefaultLimit.setHandler(() => 1);

const methodWithSetLimit = new Method({
  name: 'methodWithSetLimit',
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
methodWithSetLimit.setHandler(() => 1);

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
