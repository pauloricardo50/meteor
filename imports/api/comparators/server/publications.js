import { Meteor } from 'meteor/meteor';

import Comparators from '../comparators';

// Get all comparators for the current user
Meteor.publish('userComparators', function () {
  return Comparators.find({
    userId: this.userId,
  });
});
