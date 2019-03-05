import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './proLoans';
import { proLoansResolver } from './resolvers';

query.expose({
  firewall(userId, params) {
    const { userId: providedUserId } = params;
    params.calledByUserId = userId;

    if (SecurityService.isUserAdmin(userId) && providedUserId) {
      params.userId = providedUserId;
    } else {
      params.userId = userId;
    }

    SecurityService.checkUserIsPro(userId);
  },
  validateParams: {
    promotionId: Match.Maybe(Match.OneOf(String, Object)),
    propertyId: Match.Maybe(Match.OneOf(String, Object)),
    userId: String,
    calledByUserId: String,
  },
});

query.resolve(proLoansResolver);
