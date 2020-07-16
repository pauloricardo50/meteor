import './startup';
import 'core/api/server';
import 'core/api/api';
import 'core/fixtures';
import 'core/startup/server/monti';
import 'core/startup/accounts-config';
import './restAPI';
import 'core/api/users/server/accounts-server-config';
import 'core/api/sessions/server/startup';
import './momentOffset';
// CRONs
import './crons';

// Should only be used in development
// Saves traces as a json file
if (process.env.SAVED_TRACE_PATH) {
  require('./nested-tracer.js');
}
