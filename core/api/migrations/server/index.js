import { Migrations } from 'meteor/percolate:migrations';

import './1';
import './2';
import './3';
import './4';
import './5';
import './6';
import './7';

// To migrate to a specific version
// Migrations.migrateTo(2);
// To redo a migration
// Migrations.migrateTo(`3,rerun`);
export const migrate = () => {
  Migrations.migrateTo('latest');
};
