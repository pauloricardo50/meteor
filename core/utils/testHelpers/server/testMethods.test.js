import { Meteor } from 'meteor/meteor';

import { resetDatabase } from '../testHelpers';

if (!Meteor.default_server.method_handlers.resetDatabase) {
  Meteor.methods({
    resetDatabase() {
      return resetDatabase();
    },
  });
}
