import './1';
import './2';
import './3';
import './4';
import './5';
import './6';
import './7';
import './8';
import './9';
import './10';
import './11';
import './12';
import './13';
import './14';
import './15';
import './16';
import './17';
import './18';
import './19';
import './20';
import './21';
import './22';
import './23';
import './24';
import './25';
import './26';
import './27';
import './28';
import './29';
import './30';
import './31';
import './32';
import './33';
import './34';
import './35';
import './36';
import './37';
import './38';
import './39';
import './40';

import { Migrations } from 'meteor/percolate:migrations';

// To migrate to a specific version
// Migrations.migrateTo(2);
// To redo a migration
// Migrations.migrateTo(`3,rerun`);
export const migrate = () => {
  Migrations.migrateTo('latest');
};
