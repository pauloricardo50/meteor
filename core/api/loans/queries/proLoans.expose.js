import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './proLoans';
import { proLoansResolver, getLoanIds } from './resolvers';
import QueryCacher from '../../helpers/server/QueryCacher';

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

const cacher = new QueryCacher({
  getDataToHash: getLoanIds({ withReferredBy: true }),
  ttl: 60 * 1000,
});

query.cacheResults(cacher);
