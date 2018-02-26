import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import Tasks from '../tasks';

Meteor.publish('allTasks', function publish() {
  // Verify if the current user is an admin
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    // Return all tasks
    return Tasks.find();
  }

  return this.ready();
});

Meteor.publish('task', function publish(taskId) {
  check(taskId, String);
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    return Tasks.find({ _id: taskId });
  }
  // Return an empy cursor if not logged in
  return this.ready();
});
