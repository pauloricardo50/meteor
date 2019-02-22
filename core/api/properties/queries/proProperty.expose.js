import { Match } from 'meteor/check';

import Security from '../../security';
import query from './proProperty';

query.expose({
  firewall(userId, params) {
    Security.properties.isAllowedToRead(params.propertyId, userId);
  },
  validateParams: { propertyId: String },
  embody: {
    $filter({ filters, params }) {
      filters._id = params.propertyId;
    },
  },
});
