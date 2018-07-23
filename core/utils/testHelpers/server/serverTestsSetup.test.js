import { resetDatabase } from 'meteor/xolvio:cleaner';

// this imports everything needed on the server
import '../../../api';
import '../../../api/api-server';

console.log('Setting up tests on the server');
resetDatabase();
