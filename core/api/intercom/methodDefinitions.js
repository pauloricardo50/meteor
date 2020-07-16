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
    visotorId: Match.Maybe(Match.OneOf(String, null)),
    trackingId: Match.Maybe(Match.OneOf(String, null)),
    intercomId: Match.Maybe(Match.OneOf(String, null)),
  },
  doNotRefetchQueries: true,
});
