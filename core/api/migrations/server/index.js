import { Migrations } from 'meteor/percolate:migrations';

import './1';
import './3';

// To migrate to a specific version
// Migrations.migrateTo(2);
// To redo a migration
// Migrations.migrateTo(`3,rerun`);
export const migrate = () => {
  Migrations.migrateTo('latest');
};
