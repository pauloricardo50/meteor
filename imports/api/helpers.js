import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

export function validateUser() {
  const userId = Meteor.userId();

  if (!userId) {
    throw new Meteor.Error('unauthorized', 'Please log in');
  }
}
