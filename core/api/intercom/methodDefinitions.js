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
});
