import { Match } from 'meteor/check';

import query from './currentUser';

query.expose({
  firewall(userId, params) {
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
