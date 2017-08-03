import { Meteor } from 'meteor/meteor';

import Comparators from '../comparators';

// Get all comparators for the current user
Meteor.publish('userComparators', function () {
  // Verify if user is logged In
  if (!Meteor.userId()) {
    return this.ready();
  }

  return Comparators.find({
    userId: Meteor.userId(),
  });
});
