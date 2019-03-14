import SecurityService from '../../security';
import query from './proPromotionLoans';
import { proPromotionLoansResolver } from './resolvers';

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
