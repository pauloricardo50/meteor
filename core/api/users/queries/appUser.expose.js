import { Match } from 'meteor/check';

import query from './appUser';

query.expose({
  firewall(userId, params) {
    params.userId = userId;
  },
  embody: {
    $filter({ filters, params }) {
      filters._id = params.userId;
    },
  },
  validateParams: { userId: Match.Maybe(String) },
});
