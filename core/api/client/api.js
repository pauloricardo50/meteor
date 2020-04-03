import '../methods/client';
import '../events/ClientEventService/registerClientListeners';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { analyticsLogin } from '../analytics/methodDefinitions';
import ClientEventService from '../events/ClientEventService';

// Allow dispatching events from the client in app tests
// to refetch queries for example
if (Meteor.isAppTest) {
  window.ClientEventService = ClientEventService;
}

Accounts.onLogin(({ type }) => {
  analyticsLogin.run({ type });
});
