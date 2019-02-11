import SecurityService from '../../security';
import query from './proPromotions';
import { proPromotions } from '../../fragments';
import PromotionService from '../server/PromotionService';
import { handlePromotionLotsAnonymization } from '../server/promotionServerHelpers';

query.expose({
  firewall(userId, params) {
    SecurityService.checkUserIsPro(userId);
    params.userId = userId;
  },
  validateParams: { userId: String },
});

query.resolve(({ userId }) => {
  const promotions = PromotionService.fetch({
    $filters: { 'userLinks._id': userId },
    ...proPromotions(),
  });

  try {
    SecurityService.checkCurrentUserIsAdmin();
    return promotions;
  } catch (error) {
    return promotions.map((promotion) => {
      const { promotionLots, ...rest } = promotion;
      return {
        promotionLots: handlePromotionLotsAnonymization({
          promotionLots,
          userId,
        }),
        ...rest,
      };
    });
  }
});
