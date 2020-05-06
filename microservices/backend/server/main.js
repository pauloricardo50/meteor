import { Roles } from 'meteor/alanning:roles';

console.log('--------------------------');
console.log('MIGRATING USERS');
console.log('--------------------------');
Roles._forwardMigrate();
console.log('DONE MIGRATING USERS');

import '../imports/startup/server';
