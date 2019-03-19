import { Match } from 'meteor/check';

import SecurityService from '../../security';
import UserService from '../server/UserService';
import query from './referredUsers';

query.expose({
  firewall(userId, params) {
    if (SecurityService.isUserAdmin(userId)) {
      return;
    }

    SecurityService.checkUserIsPro(userId);

    if (params.userId && params.userId !== userId) {
      SecurityService.handleUnauthorized("Pas le droit d'accéder à un autre utilisateur");
    }

    if (params.organisationId) {
      const { organisations = [] } = UserService.fetchOne({
        $filters: { _id: userId },
        organisations: { _id: 1 },
      });

      if (
        !organisations.map(({ _id }) => _id).includes(params.organisationId)
      ) {
        SecurityService.handleUnauthorized("Vous n'avez pas accès à cette organisation");
      }
    }
  },
  embody: {
    $filter({ filters, params: { organisationId, userId } }) {
      if (organisationId) {
        filters.referredByOrganisationLink = organisationId;
      }
      if (userId) {
        filters.referredByUserLink = userId;
      }
    },
  },
  validateParams: {
    organisationId: Match.Maybe(String),
    userId: Match.Maybe(String),
  },
});
