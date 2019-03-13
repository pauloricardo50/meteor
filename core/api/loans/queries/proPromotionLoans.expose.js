import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './proPromotionLoans';
import { proPromotionLoansResolver, getLoanIds } from './resolvers';
import QueryCacher from '../../helpers/server/QueryCacher';

query.expose({
  firewall(userId, params) {
    const { promotionId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToView({
      userId,
      promotionId,
    });
  },
  validateParams: {
    promotionId: String,
    userId: String,
  },
});

query.resolve(({ userId, promotionId }) =>
  proPromotionLoansResolver({ calledByUserId: userId, promotionId }));

const cacher = new QueryCacher({
  getDataToHash: getLoanIds(),
  ttl: 60 * 60 * 1000,
});

query.cacheResults(cacher);
