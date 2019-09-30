import './startup';
import 'core/api/server';
import 'core/api/api';
import 'core/fixtures';
import 'core/startup/server/kadira';
import 'core/startup/accounts-config';
import './restAPI';
import 'core/api/sessions/server/startup';

// CRONs
import 'core/api/loans/server/expireLoansCron';
import 'core/api/notifications/server/notificationGeneratorCron';
import 'core/api/updateWatchers/server/updateWatcherCron';
import './fetchIrs10yCron';
import 'core/api/sessions/server/removeOldSessionsCron';
