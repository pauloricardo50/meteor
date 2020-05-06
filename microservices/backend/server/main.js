import '../imports/startup/server';

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

console.log('SETTING UP METEOR.STARTUP');
Meteor.startup(() => {
  console.log('--------------------------');
  console.log('MIGRATING USERS');
  console.log('--------------------------');

  Roles._forwardMigrate();
  console.log('DONE MIGRATING USERS');
});
