import { Match } from 'meteor/check';
import SecurityService from '../../security';
import query from './proOrganisation';

query.expose({
  firewall: (userId, params) => {
    SecurityService.checkUserIsPro(userId);
  },
  validateParams: { organisationId: String, $body: Match.Maybe(Object) },
  embody: {
    $filter({ filters, params: { organisationId } }) {
      filters._id = organisationId;
    },
  },
});
