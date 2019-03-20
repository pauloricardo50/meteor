import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import UserService from '../../users/server/UserService';
import SecurityService from '../../security';
import query from './organisationLoans';

query.expose({
  firewall(userId, params) {
    if (params.organisationId) {
      SecurityService.checkUserIsAdmin(userId);
    } else {
      const { organisations } = UserService.fetchOne({
        $filters: { _id: userId },
        organisations: { _id: 1 },
      });

      if (!organisations || organisations.length === 0) {
        throw new Meteor.Error("Pas d'organisation!");
      }

      params.organisationId = organisations[0]._id;
    }
  },
  validateParams: { organisationId: Match.Maybe(String) },
  embody: {
    $filter({ filters, params: { organisationId } }) {
      filters['userCache.referredByOrganisationLink'] = organisationId;
    },
    user: { organistationLink: 1 },
  },
});
