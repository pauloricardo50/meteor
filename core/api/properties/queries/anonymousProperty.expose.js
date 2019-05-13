import { Match } from 'meteor/check';

import Security from '../../security';
import query from './anonymousProperty';

query.expose({
  firewall(userId, { _id }) {
    Security.properties.checkPropertyIsPublic({ propertyId: _id });
  },
  validateParams: { _id: String, $body: Match.Maybe(Object) },
});
