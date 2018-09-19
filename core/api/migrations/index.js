import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

import { MIGRATIONS } from './migrationConstants';
import './1.2.1';

// This is imported in admin server, so it's the only one who migrates data
Meteor.startup(() => {
  Migrations.migrateTo(MIGRATIONS['1.2.1']);

  // To redo a migration
  // Migrations.migrateTo(`${MIGRATIONS['1.2.1']},rerun`);
});
