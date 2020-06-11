import { Meteor } from 'meteor/meteor';

import resetDatabase from '../../../utils/testHelpers/resetDatabase';

Meteor.methods({
  resetDatabase() {
    resetDatabase();
  },
});
