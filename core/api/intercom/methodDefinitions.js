import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const getIntercomSettings = new Method({
  name: 'getIntercomSettings',
  params: {},
  doNotRefetchQueries: true,
});

export const getIntercomContact = new Method({
  name: 'getIntercomContact',
  params: {
    email: Match.Maybe(String),
    contactId: Match.Maybe(String),
  },
  doNotRefetchQueries: true,
});

export const updateIntercomVisitorTrackingId = new Method({
  name: 'updateIntercomVisitorTrackingId',
  params: {
    visitorId: Match.Maybe(String),
    trackingId: Match.Maybe(String),
    intercomId: Match.Maybe(String),
  },
  doNotRefetchQueries: true,
});
