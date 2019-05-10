import { Match } from 'meteor/check';

import query from './currentUser';

query.expose({
  firewall(userId, params) {
    if (!userId) {
      // Don't throw unauthorized error here, it causes race-conditions in E2E tests
      // to not reload this subscription
      // So simply set userId to an impossible id
      params.userId = 'none';
    }
    params._id = userId;
  },
  validateParams: { _id: Match.Maybe(String), $body: Match.Maybe(Object) },
  embody: {
    // This will deepExtend your body
    $filter({ filters, params }) {
      filters._id = params._id;
    },
  },
});
