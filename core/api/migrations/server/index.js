import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

import './1';

// This is imported in admin server, so it's the only one that migrates data
Meteor.startup(() => {
  // Warning dangerous!
  Migrations.migrateTo('latest');
});

// To migrate to a specific version
// Migrations.migrateTo(2);
// To redo a migration
// Migrations.migrateTo(`3,rerun`);
