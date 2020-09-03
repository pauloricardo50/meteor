import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import resetDatabase from '../../../utils/testHelpers/resetDatabase';

Accounts.removeDefaultRateLimit();

Meteor.methods({
  resetDatabase() {
    resetDatabase();
  },
});
