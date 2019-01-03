import '../testInit.test';

import { resetDatabase } from 'meteor/xolvio:cleaner';

// this imports everything needed on the server
import '../../api';
import '../../api/api-server';

resetDatabase();
