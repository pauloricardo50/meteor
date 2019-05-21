import { Meteor } from 'meteor/meteor';

import '../methods/client';
import '../events/ClientEventService/registerClientListeners';
import { Accounts } from 'meteor/accounts-base';
import { getCookie } from 'core/utils/cookiesHelpers';
import ClientEventService from '../events/ClientEventService';
import { analyticsLogin } from '../methods/index';
import { TRACKING_COOKIE } from '../analytics/analyticsConstants';

// Allow dispatching events from the client in app tests
// to refetch queries for example
if (Meteor.isAppTest) {
  window.ClientEventService = ClientEventService;
}

Accounts.onLogin(() => {
  analyticsLogin.run({ trackingId: getCookie(TRACKING_COOKIE) });
});
