import { Match } from 'meteor/check';

import Security from '../../security';
import query from './anonymousProperty';

query.expose({
  firewall(userId, { _id }) {
    Security.properties.checkPropertyIsPublic({ propertyId: _id });
  },
  embody: {
    $filter({ filters, params: { _id } }) {
      filters._id = _id;
    },
  },
  validateParams: { _id: String, $body: Match.Maybe(Object) },
});
