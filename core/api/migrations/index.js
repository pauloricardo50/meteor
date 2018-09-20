import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

import { MIGRATIONS } from './migrationConstants';
import './1.3';

// This is imported in admin server, so it's the only one that migrates data
Meteor.startup(() => {
  // Migrations.migrateTo('latest');
});

// To migrate to a specific version
// Migrations.migrateTo(MIGRATIONS['1.2.1']);
// To redo a migration
// Migrations.migrateTo(`${MIGRATIONS['1.2.1']},rerun`);
