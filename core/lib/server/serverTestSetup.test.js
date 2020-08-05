import '../testInit.test';
import './test/server/accounts.test';

// this imports everything needed on the server
import '../../api/server';
import '../../api/api';

// Needed by the client tests
import 'core/api/methods/server/test/serverMethods-app-test.js';
import 'core/api/queries/test/server/serverQueries-app-test.js';

import { resetDatabase } from '../../utils/testHelpers';

resetDatabase();
