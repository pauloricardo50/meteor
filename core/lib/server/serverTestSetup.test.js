import '../testInit.test';
// this imports everything needed on the server
import '../../api/server';
import '../../api/api';

import { resetDatabase } from '../../utils/testHelpers';

resetDatabase();
