import './startup';
import 'core/api/server';
import 'core/api/api';
import 'core/fixtures';
import 'core/startup/server';
import 'core/startup/accounts-config';
import './restAPI';

// CRONs
import 'core/api/loans/server/expireLoansCron';
import 'core/api/notifications/server/notificationGeneratorCron';
import 'core/api/updateWatchers/server/updateWatcherCron';
import './fetchIrs10yCron';

import { validateLoginAttempt } from 'core/api/users/server/accounts-server-config';

validateLoginAttempt();
