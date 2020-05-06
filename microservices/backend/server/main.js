import '../imports/startup/server';

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.startup(() => {
  Roles._forwardMigrate();
});
