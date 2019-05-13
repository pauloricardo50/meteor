import { Match } from 'meteor/check';

import query from './appUser';

query.expose({
  firewall(userId, params) {
    if (!userId) {
      // Don't throw unauthorized error here, it causes race-conditions in E2E tests
      // to not reload this subscription
      // So simply set userId to an impossible id
      params.userId = 'none';
    }
    params.userId = userId;
  },
  embody: {
    $filter({ filters, params }) {
      filters._id = params.userId;
    },
  },
  validateParams: { userId: Match.Maybe(String) },
});
