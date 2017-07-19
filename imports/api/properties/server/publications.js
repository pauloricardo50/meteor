import { Meteor } from 'meteor/meteor';

import Properties from '../properties';

// Get all properties for the current user
Meteor.publish('userProperties', function () {
  return Properties.find({
    userId: this.userId,
  });
});
