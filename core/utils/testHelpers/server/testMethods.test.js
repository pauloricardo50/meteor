import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';

if (!Meteor.default_server.method_handlers.resetDatabase) {
  Meteor.methods({
    resetDatabase,
  });
}
