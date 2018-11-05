import { Meteor } from 'meteor/meteor';
import SlackService from './slack/SlackService';

import 'core/fixtures/fixtureMethods';

import './users/server/accounts-server-config';

import './methods/server';
import './methods';

import './factories';

import './files/server/methods';
import './files/server/meteor-slingshot-server';

import './email/server';

import './events/server/registerServerListeners';

import './links';
import './reducers';

import './server/grapher-live';
import './server/hooks';
import './server/queries';
import './server/reducers';
import './server/mongoIndexes';

// const originalMeteorDebug = Meteor._debug;
// Meteor._debug = (message, stack) => {
//   const error = new Error(message);
//   error.stack = stack;
//   SlackService.sendError(error, 'Server error');

//   return originalMeteorDebug.apply(this, arguments);
// };
