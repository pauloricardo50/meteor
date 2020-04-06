import '../testInit.test';

import { resetDatabase } from 'meteor/xolvio:cleaner';

// this imports everything needed on the server
import '../../api/server';
import '../../api/api';

resetDatabase();
