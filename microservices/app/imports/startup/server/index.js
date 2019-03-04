import { Inject } from 'meteor/meteorhacks:inject-initial';

import './kadira.js';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));
