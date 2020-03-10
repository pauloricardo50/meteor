import { Meteor } from 'meteor/meteor';

import '../methods/client';
import '../events/ClientEventService/registerClientListeners';
import { Accounts } from 'meteor/accounts-base';
import ClientEventService from '../events/ClientEventService';
import { analyticsLogin } from '../methods/index';

// Allow dispatching events from the client in app tests
// to refetch queries for example
if (Meteor.isAppTest) {
  window.ClientEventService = ClientEventService;
}

Accounts.onLogin(({ type }) => {
  if (type === 'password') {
    analyticsLogin.run({});
  }
});
