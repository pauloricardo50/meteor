import { Meteor } from 'meteor/meteor';

import Properties from '../properties';

// Get all properties for the current user
Meteor.publish('userProperties', function () {
  // Verify if user is logged In
  if (!Meteor.userId()) {
    return this.ready();
  }

  return Properties.find({
    userId: Meteor.userId(),
  });
});
