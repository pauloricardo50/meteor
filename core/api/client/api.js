import { Meteor } from 'meteor/meteor';

import '../methods/client';
import '../events/ClientEventService/registerClientListeners';
import ClientEventService from '../events/ClientEventService';

// Allow dispatching events from the client in app tests
// to refetch queries for example
if (Meteor.isAppTest) {
  window.ClientEventService = ClientEventService;
}
